import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getDeterministicUUID, UUID_NAMESPACE } from '../script/generate'

test('L6: getDeterministicUUID generates deterministic 32-character hex UUIDs without hyphens', () => {
    const input = 'template-folder:functionName'
    const uuid1 = getDeterministicUUID(input)
    const uuid2 = getDeterministicUUID(input)

    assert.equal(uuid1, uuid2, 'Subsequent calls with the same input must be deterministic')
    assert.equal(uuid1.length, 32, 'UUID must be 32 characters without hyphens')
    assert.ok(!uuid1.includes('-'), 'UUID must not contain hyphens')
    assert.match(uuid1, /^[0-9a-f]{32}$/, 'UUID must be a valid hex string')

    const differentInput = 'template-folder:otherFunctionName'
    const uuidDifferent = getDeterministicUUID(differentInput)
    assert.notEqual(uuid1, uuidDifferent, 'Different inputs must produce different UUIDs')
})

test('L6: custom namespace yields deterministic UUID for that namespace', () => {
    const customNamespace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
    const uuidDefault = getDeterministicUUID('input', UUID_NAMESPACE)
    const uuidCustom = getDeterministicUUID('input', customNamespace)

    assert.equal(uuidDefault, getDeterministicUUID('input', UUID_NAMESPACE))
    assert.notEqual(uuidDefault, uuidCustom)
})
