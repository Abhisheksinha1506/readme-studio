import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import { FullTemplateModel } from '../src/api/templates/template.model'
import { startTestApp } from './helpers/app'

let baseUrl: string
let stop: () => Promise<void>

before(async () => {
    ;({ baseUrl, stop } = await startTestApp())
})

after(async () => {
    await stop()
})

test('M3: default blocks follow startupBlocks order and contain no holes', async () => {
    const template = await FullTemplateModel.findOne({}).orFail()
    const [first, second, third] = template.functions.map((block) => block.function)
    // Leaves out every other block, reverses the order and references a block that does not exist.
    const startupBlocks = [third, 'missingBlock', first]
    await FullTemplateModel.updateOne({ folder: template.folder }, { $set: { startupBlocks } })

    const response = await fetch(`${baseUrl}/v1/template/template/${template.folder}/defaultBlocks`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(
        body.responseObject.map((block: { function: string } | null) => block?.function),
        [third, first]
    )
    assert.ok(!body.responseObject.some((block: { function: string }) => block.function === second))
})
