import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import { startTestApp } from './helpers/app'

let baseUrl: string
let stop: () => Promise<void>

before(async () => {
    ;({ baseUrl, stop } = await startTestApp())
})

after(async () => {
    await stop()
})

const template = 'othneildrew-best-readme-template'

test('M1: preview rejects an id that escapes the public directory', async () => {
    // Decodes to "../test/fixtures", which resolves to backend/test/fixtures/preview.md.
    const response = await fetch(`${baseUrl}/v1/template/template/..%2Ftest%2Ffixtures/preview`)
    const text = await response.text()

    assert.equal(response.status, 400)
    assert.doesNotMatch(text, /TRAVERSAL-MARKER/)
    assert.equal(JSON.parse(text).success, false)
})

test('M1: ids with characters outside [a-z0-9-] are rejected', async () => {
    for (const id of ['Upper-Case', 'dot.name', 'under_score', 'a%2Fb']) {
        const preview = await fetch(`${baseUrl}/v1/template/template/${id}/preview`)
        const defaultBlocks = await fetch(`${baseUrl}/v1/template/template/${id}/defaultBlocks`)

        assert.equal(preview.status, 400, id)
        assert.equal(defaultBlocks.status, 400, id)
    }
})

test('M1: valid template ids still resolve', async () => {
    const preview = await fetch(`${baseUrl}/v1/template/template/${template}/preview`)
    const defaultBlocks = await fetch(`${baseUrl}/v1/template/template/${template}/defaultBlocks`)

    assert.equal(preview.status, 200)
    assert.ok((await preview.json()).responseObject.length > 0)
    assert.equal(defaultBlocks.status, 200)
    assert.ok((await defaultBlocks.json()).responseObject.length > 0)
})

test('M1: the frontend placeholder id "undefined" keeps its existing responses', async () => {
    const preview = await fetch(`${baseUrl}/v1/template/template/undefined/preview`)
    const defaultBlocks = await fetch(`${baseUrl}/v1/template/template/undefined/defaultBlocks`)

    assert.equal(preview.status, 200)
    assert.equal(defaultBlocks.status, 400)
})
