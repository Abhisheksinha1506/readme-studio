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

test('POST /v1/template/compile renders the same output as the backend render pipeline for default values', async () => {
    const blocks = readJson<TemplateBlocks>(path.join(PUBLIC_DIR, template, 'blocks.json'))
    const macrosByFunction = readJson<Record<string, string>>(path.join(PUBLIC_DIR, template, 'macros.json'))
    const orderedBlocks = orderedStartupBlocks(blocks)
    const macros = orderedBlocks.map((block) => macrosByFunction[block.function] ?? '').join('')
    const variables: Record<string, unknown> = {}
    for (const block of orderedBlocks) {
        for (const variable of block.variables) {
            variables[variable.name] = variable.defaultValue
        }
    }

    const response = await fetch(`${baseUrl}/v1/template/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macros, templateBlocks: orderedBlocks, variables }),
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.success, true)
    assert.equal(body.responseObject, renderTemplate(template))
})

test('POST /v1/template/compile reflects a changed variable value', async () => {
    const response = await fetch(`${baseUrl}/v1/template/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            macros: '{% macro greetMacro() %}{{ greeting }}{% endmacro %}',
            templateBlocks: [
                {
                    name: 'Greeting',
                    description: 'A greeting',
                    function: 'greetMacro',
                    folder: template,
                    variables: [{ label: 'Greeting', name: 'greeting', defaultValue: 'Hello', _type: 'input' }],
                },
            ],
            variables: { greeting: 'Hello, World!' },
        }),
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.responseObject.trim(), 'Hello, World!')
})

test('POST /v1/template/compile rejects a malformed body', async () => {
    const response = await fetch(`${baseUrl}/v1/template/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macros: 'x' }),
    })

    assert.equal(response.status, 400)
})
