import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import { MacroModel } from '../src/api/templates/template.model'
import { startTestApp } from './helpers/app'

let baseUrl: string
let stop: () => Promise<void>

before(async () => {
    ;({ baseUrl, stop } = await startTestApp())
})

after(async () => {
    await stop()
})

const postMacros = (body: unknown) =>
    fetch(`${baseUrl}/v1/template/template/%7Bid%7D/macros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

test('M2: a body that is not an array is rejected with 400', async () => {
    const response = await postMacros({})

    assert.equal(response.status, 400)
})

test('M2: query operators in place of strings are rejected with 400', async () => {
    const response = await postMacros([{ folder: { $ne: null }, function: { $regex: '.*' } }])
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.responseObject, null)
})

test('M2: more than 100 blocks are rejected with 400', async () => {
    const block = { folder: 'othneildrew-best-readme-template', function: 'anything' }

    assert.equal((await postMacros(Array(101).fill(block))).status, 400)
    assert.equal((await postMacros(Array(100).fill(block))).status, 200)
})

test('M2: macros are returned in request order, repeats included, unknown blocks skipped', async () => {
    const [first, second] = await MacroModel.find({}).limit(2).lean()
    const toBlock = (macro: { folder: string; name: string }) => ({ folder: macro.folder, function: macro.name })

    const response = await postMacros([toBlock(second), { folder: second.folder, function: 'unknownBlock' }, toBlock(first), toBlock(second)])
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.responseObject, second.content + first.content + second.content)
})

test('M2: an empty list returns an empty string', async () => {
    const response = await postMacros([])
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.responseObject, '')
})
