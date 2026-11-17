import './helpers/env'

import assert from 'node:assert/strict'
import os from 'node:os'
import { after, before, test } from 'node:test'

import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import { FullTemplateModel, MacroModel } from '../src/api/templates/template.model'
import { initTemplates } from '../src/db'

let mongod: MongoMemoryServer

before(async () => {
    mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
})

after(async () => {
    await mongoose.disconnect()
    await mongod.stop()
})

test('H3: reseeding keeps existing documents instead of dropping them', async () => {
    await initTemplates()
    const templatesBefore = await FullTemplateModel.find({}, { folder: 1 }).lean()
    const macrosBefore = await MacroModel.find({}, { name: 1 }).lean()
    assert.ok(templatesBefore.length > 0)
    assert.ok(macrosBefore.length > 0)

    await initTemplates()
    const templatesAfter = await FullTemplateModel.find({}, { folder: 1 }).lean()
    const macrosAfter = await MacroModel.find({}, { name: 1 }).lean()

    const ids = (docs: { _id: unknown }[]) => docs.map((doc) => String(doc._id)).sort()
    assert.deepEqual(ids(templatesAfter), ids(templatesBefore))
    assert.deepEqual(ids(macrosAfter), ids(macrosBefore))
})

test('H3: seed keys are protected by unique indexes', async () => {
    await initTemplates()
    const templateIndexes = await FullTemplateModel.collection.indexes()
    const macroIndexes = await MacroModel.collection.indexes()

    assert.ok(templateIndexes.some((index) => index.unique && JSON.stringify(index.key) === '{"folder":1}'))
    assert.ok(macroIndexes.some((index) => index.unique && JSON.stringify(index.key) === '{"folder":1,"name":1}'))
})

test('H3: entries removed from disk are pruned', async () => {
    await initTemplates()
    await MacroModel.collection.insertOne({ folder: 'removed-template', name: 'removedMacro', content: 'stale' })

    await initTemplates()

    assert.equal(await MacroModel.countDocuments({ folder: 'removed-template' }), 0)
})

test('H3: unreadable seed data rejects and leaves stored data untouched', async () => {
    await initTemplates()
    const templateCount = await FullTemplateModel.countDocuments()
    const backendDirectory = process.cwd()

    process.chdir(os.tmpdir())
    try {
        await assert.rejects(initTemplates())
    } finally {
        process.chdir(backendDirectory)
    }

    assert.equal(await FullTemplateModel.countDocuments(), templateCount)
})
