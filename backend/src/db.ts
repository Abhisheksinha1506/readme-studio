import mongoose, { Collection, mongo } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Environment, PRODUCTION_OR_DEVELOPMENT, MONGO_PRIVATE_URL } from './common/utils/env'
import { FullTemplateModel, MacroModel } from './api/templates/template.model'
import { createMacroObjects, createTemplateObjects } from './common/utils/helper'

let mongoDBConnection: string = ''
let mongoConnectionOptions: mongoose.ConnectOptions = {}

const connectToDevDB = async () => {
    const mongod = new MongoMemoryServer()
    await mongod.start()
    mongoDBConnection = mongod.getUri()
}

const connectToProdDB = () => {
    mongoDBConnection = MONGO_PRIVATE_URL
    mongoConnectionOptions = {
        autoIndex: false,
        dbName: 'makereadme',
    }
}

/**
 * Seeds templates and macros from ./public into MongoDB.
 *
 * Upserts by natural key (template `folder`, macro `folder` + `name`) and prunes entries that are
 * no longer on disk, so collections are never emptied while other instances serve requests.
 *
 * @throws When seed data is missing, unreadable or cannot be written, so boot fails loudly.
 */
export const initTemplates = async () => {
    const templates = createTemplateObjects()
    if (!templates?.length) {
        throw Error('Failed to read template data')
    }

    const macros = createMacroObjects()
    if (!macros?.length) {
        throw Error('Failed to read macros data')
    }

    // Production connects with autoIndex disabled, so unique indexes are built explicitly.
    await FullTemplateModel.createIndexes()
    await MacroModel.createIndexes()

    await FullTemplateModel.bulkWrite(templates.map((template) => ({ replaceOne: { filter: { folder: template.folder }, replacement: template, upsert: true } })))
    await FullTemplateModel.deleteMany({ folder: { $nin: templates.map((template) => template.folder) } })

    await MacroModel.bulkWrite(macros.map(({ folder, name, content }) => ({ updateOne: { filter: { folder, name }, update: { $set: { content } }, upsert: true } })))
    await MacroModel.deleteMany({ $nor: macros.map(({ folder, name }) => ({ folder, name })) })
}

export const initMongoDB = async () => {
    try {
        if (PRODUCTION_OR_DEVELOPMENT === Environment.PRODUCTION) {
            connectToProdDB()
        } else {
            await connectToDevDB()
        }

        await mongoose.connect(mongoDBConnection, mongoConnectionOptions)
        await initTemplates()
        console.log('🚀 MongoDB Connected')
    } catch (error) {
        console.error('MongoDB connection error. Please make sure MongoDB is running.', error)
        process.exit(1)
    }
}
