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

test('L3: pageType is matched with exact equality (===), not substring inclusion', async () => {
    const resExact = await fetch(`${baseUrl}/v1/sidebar/all?pageType=ReadME`)
    const bodyExact = await resExact.json()
    assert.equal(resExact.status, 200)
    assert.ok(bodyExact.responseObject.length > 0)
    for (const t of bodyExact.responseObject) {
        assert.equal(t.pageType, 'ReadME')
    }

    // A superstring query like 'ReadMEExtra' must not match 'ReadME'
    const resSuperstring = await fetch(`${baseUrl}/v1/sidebar/all?pageType=ReadMEExtra`)
    const bodySuperstring = await resSuperstring.json()
    assert.equal(resSuperstring.status, 200)
    assert.equal(bodySuperstring.responseObject.length, 0)

    // A substring query like 'Read' must not match 'ReadME'
    const resSubstring = await fetch(`${baseUrl}/v1/sidebar/all?pageType=Read`)
    const bodySubstring = await resSubstring.json()
    assert.equal(resSubstring.status, 200)
    assert.equal(bodySubstring.responseObject.length, 0)
})
