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

test('L4: ?filter= produces an empty filter array and returns templates without filtering', async () => {
    const responseAllWithoutFilter = await fetch(`${baseUrl}/v1/sidebar/all`)
    const bodyWithoutFilter = await responseAllWithoutFilter.json()
    assert.equal(responseAllWithoutFilter.status, 200)
    assert.ok(bodyWithoutFilter.responseObject.length > 0)

    const responseAllWithEmptyFilter = await fetch(`${baseUrl}/v1/sidebar/all?filter=`)
    const bodyWithEmptyFilter = await responseAllWithEmptyFilter.json()
    assert.equal(responseAllWithEmptyFilter.status, 200)
    assert.equal(bodyWithEmptyFilter.responseObject.length, bodyWithoutFilter.responseObject.length)

    const responseTemplateWithoutFilter = await fetch(`${baseUrl}/v1/sidebar/template`)
    const bodyTemplateWithoutFilter = await responseTemplateWithoutFilter.json()
    assert.equal(responseTemplateWithoutFilter.status, 200)

    const responseTemplateWithEmptyFilter = await fetch(`${baseUrl}/v1/sidebar/template?filter=`)
    const bodyTemplateWithEmptyFilter = await responseTemplateWithEmptyFilter.json()
    assert.equal(responseTemplateWithEmptyFilter.status, 200)
    assert.equal(bodyTemplateWithEmptyFilter.responseObject.length, bodyTemplateWithoutFilter.responseObject.length)
})
