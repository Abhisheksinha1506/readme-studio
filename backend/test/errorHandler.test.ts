import assert from 'node:assert/strict'
import { once } from 'node:events'
import { AddressInfo } from 'node:net'
import { after, before, test } from 'node:test'

import express from 'express'

import errorHandler from '../src/common/middleware/errorHandler'
import { startTestApp } from './helpers/app'

let baseUrl: string
let stop: () => Promise<void>

before(async () => {
    ;({ baseUrl, stop } = await startTestApp())
})

after(async () => {
    await stop()
})

test('M4: malformed JSON body returns a ServiceResponse without a stack trace', async () => {
    const response = await fetch(`${baseUrl}/v1/template/template/any/macros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"broken": ',
    })
    const text = await response.text()

    assert.equal(response.status, 400)
    assert.match(response.headers.get('content-type') ?? '', /application\/json/)
    assert.deepEqual(JSON.parse(text), { success: false, message: 'Bad Request', responseObject: null, statusCode: 400 })
    assert.doesNotMatch(text, /SyntaxError|node_modules|\bat /)
})

test('M4: unknown route returns 404', async () => {
    const response = await fetch(`${baseUrl}/v1/does-not-exist`)

    assert.equal(response.status, 404)
})

test('M4: error thrown by a route returns a generic 500 ServiceResponse', async () => {
    const app = express()
    app.get('/boom', () => {
        throw new Error('secret internal detail')
    })
    app.use(errorHandler())
    const server = app.listen(0)
    await once(server, 'listening')

    try {
        const response = await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/boom`)
        const text = await response.text()

        assert.equal(response.status, 500)
        assert.deepEqual(JSON.parse(text), { success: false, message: 'Internal Server Error', responseObject: null, statusCode: 500 })
        assert.doesNotMatch(text, /secret internal detail/)
    } finally {
        server.close()
    }
})

test('M4: Swagger UI and its spec are still served', async () => {
    const ui = await fetch(`${baseUrl}/`)
    const init = await fetch(`${baseUrl}/swagger-ui-init.js`)
    const spec = await fetch(`${baseUrl}/swagger.json`)

    assert.equal(ui.status, 200)
    assert.match(await ui.text(), /swagger-ui/)
    assert.equal(init.status, 200)
    assert.equal(spec.status, 200)
})
