import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

const tsx = path.resolve('node_modules/.bin/tsx')
const probe = path.resolve('test/helpers/printEnvironment.ts')

/**
 * Loads the env module in a child process started from an empty directory.
 *
 * @param variables Process environment for the child.
 * @param dotenv Optional contents of a .env file placed in the child's working directory.
 */
const loadEnv = (variables: Record<string, string>, dotenv?: string) => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'env-test-'))
    if (dotenv !== undefined) {
        fs.writeFileSync(path.join(cwd, '.env'), dotenv)
    }
    const result = spawnSync(tsx, [probe], { cwd, env: { PATH: process.env.PATH!, ...variables }, encoding: 'utf8' })
    return { status: result.status, output: result.stdout + result.stderr }
}

const productionVariables = { PORT: '8080', MONGO_PRIVATE_URL: 'mongodb://127.0.0.1:27017' }

test('H2: NODE_ENV=production is treated as production without a .env file', () => {
    const { status, output } = loadEnv({ NODE_ENV: 'production', ...productionVariables })
    assert.equal(status, 0, output)
    assert.match(output, /mode=prod/)
})

test('H2: NODE_ENV=prod is still treated as production', () => {
    const { status, output } = loadEnv({ NODE_ENV: 'prod', ...productionVariables })
    assert.equal(status, 0, output)
    assert.match(output, /mode=prod/)
})

test('H2: production still requires MONGO_PRIVATE_URL', () => {
    const { status, output } = loadEnv({ NODE_ENV: 'production', PORT: '8080' })
    assert.equal(status, 1, output)
    assert.match(output, /No MONGO_PRIVATE_URL set/)
})

test('H2: dev and development are treated as development', () => {
    for (const mode of ['dev', 'development']) {
        const { status, output } = loadEnv({}, `NODE_ENV=${mode}\nPORT=8080\n`)
        assert.equal(status, 0, output)
        assert.match(output, /mode=dev/)
    }
})

test('H2: unknown NODE_ENV fails boot instead of falling back to development', () => {
    const { status, output } = loadEnv({}, 'NODE_ENV=staging\nPORT=8080\n')
    assert.equal(status, 1, output)
    assert.match(output, /Unknown NODE_ENV/)
})
