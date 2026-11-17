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

test('L2: GET /v1/sidebar/template resolves correctly without id parameter', async () => {
    const resAll = await fetch(`${baseUrl}/v1/sidebar/template`)
    const bodyAll = await resAll.json()
    assert.equal(resAll.status, 200)
    assert.equal(bodyAll.success, true)
    assert.ok(Array.isArray(bodyAll.responseObject))
    assert.ok(bodyAll.responseObject.length > 0)

    // Verify filter by folder works
    const targetFolder = bodyAll.responseObject[0].folder
    const resFiltered = await fetch(`${baseUrl}/v1/sidebar/template?filter=${targetFolder}`)
    const bodyFiltered = await resFiltered.json()
    assert.equal(resFiltered.status, 200)
    assert.equal(bodyFiltered.responseObject.length, 1)
    assert.equal(bodyFiltered.responseObject[0].folder, targetFolder)

    // Verify search works
    const resSearch = await fetch(`${baseUrl}/v1/sidebar/template?search=Header`)
    const bodySearch = await resSearch.json()
    assert.equal(resSearch.status, 200)
    assert.ok(bodySearch.responseObject.length > 0)
})
