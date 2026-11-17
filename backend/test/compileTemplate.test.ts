import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, test } from 'node:test'

import { startTestApp } from './helpers/app'
import { orderedStartupBlocks, PUBLIC_DIR, renderTemplate, TemplateBlocks } from './helpers/templateRender'

let baseUrl: string
let stop: () => Promise<void>

before(async () => {
    ;({ baseUrl, stop } = await startTestApp())
})

after(async () => {
    await stop()
})

const template = 'othneildrew-best-readme-template'

const readJson = <T>(filePath: string): T => JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

const compile = (body: unknown) =>
    fetch(`${baseUrl}/v1/template/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

test('POST /v1/template/compile renders the same output as the backend render pipeline for default values', async () => {
    const blocks = readJson<TemplateBlocks>(path.join(PUBLIC_DIR, template, 'blocks.json'))
    const orderedBlocks = orderedStartupBlocks(blocks)
    const variables: Record<string, unknown> = {}
    for (const block of orderedBlocks) {
        for (const variable of block.variables) {
            variables[variable.name] = variable.defaultValue
        }
    }

    const response = await compile({
        blocks: orderedBlocks.map((block) => ({ folder: template, function: block.function })),
        variables,
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.success, true)
    assert.equal(body.responseObject, renderTemplate(template))
})

test('POST /v1/template/compile reflects a changed variable value', async () => {
    // "Project Header" / "Headline" on othneildrew-best-readme-template.
    const headerFunction = 'e6b713de25115592b32addc6f6e6fba7'
    const headlineVariable = '79cff063dce85a38a0d0bdd27864f465'

    const response = await compile({
        blocks: [{ folder: template, function: headerFunction }],
        variables: { [headlineVariable]: 'Hello, World!' },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(body.responseObject, /Hello, World!/)
})

test('POST /v1/template/compile rejects an unknown (folder, function) pair', async () => {
    const response = await compile({
        blocks: [{ folder: template, function: 'does-not-exist' }],
        variables: {},
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.match(body.message, /Unknown block/)
})

test('POST /v1/template/compile rejects a malformed body', async () => {
    const response = await compile({ blocks: 'not-an-array' })

    assert.equal(response.status, 400)
})

test('POST /v1/template/compile does not execute Nunjucks source smuggled through a variable value', async () => {
    const headerFunction = 'e6b713de25115592b32addc6f6e6fba7'
    const headlineVariable = '79cff063dce85a38a0d0bdd27864f465'
    const payload = '{{ 7 * 7 }}'

    const response = await compile({
        blocks: [{ folder: template, function: headerFunction }],
        variables: { [headlineVariable]: payload },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    // The payload must appear verbatim, not evaluated to "49": variable values
    // are bound as the Nunjucks render context, never parsed as template source.
    assert.match(body.responseObject, /\{\{ 7 \* 7 \}\}/)
    assert.doesNotMatch(body.responseObject, /(?<!\{)\b49\b/)
})

test('POST /v1/template/compile cannot smuggle template source through the block/function identifier', async () => {
    // Only a (folder, function) pair that resolves against the database is
    // ever used to build template source; arbitrary function-name strings are
    // rejected outright rather than being concatenated into it.
    const response = await compile({
        blocks: [{ folder: template, function: '{{ 7 * 7 }}' }],
        variables: {},
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.match(body.message, /Unknown block/)
})
