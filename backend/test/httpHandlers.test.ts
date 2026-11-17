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

test('cacheFor marks a successful template response as publicly cacheable', async () => {
    const response = await fetch(`${baseUrl}/v1/template/template/othneildrew-best-readme-template/defaultBlocks`)

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'public, max-age=300')
})

test('cacheFor does not cache a 404 from an unknown template id', async () => {
    const response = await fetch(`${baseUrl}/v1/template/template/does-not-exist/defaultBlocks`)

    assert.equal(response.status, 404)
    assert.equal(response.headers.get('cache-control'), null)
})

test('cacheFor does not cache a 404 from a missing preview file', async () => {
    const response = await fetch(`${baseUrl}/v1/template/template/does-not-exist/preview`)

    assert.equal(response.status, 404)
    assert.equal(response.headers.get('cache-control'), null)
})
