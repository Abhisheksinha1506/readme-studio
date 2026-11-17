import assert from 'node:assert/strict'
import { test } from 'node:test'

import { escapeRegExp, replaceVariablesWithWordBoundaries } from '../script/generate'

test('L5: escapeRegExp properly escapes regex special characters in keys', () => {
    const specialChars = '.*+?^${}()|[]\\'
    const escaped = escapeRegExp(specialChars)
    assert.equal(escaped, '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\')

    const keyWithSpecial = 'my$var.name'
    const map = new Map<string, string>([[keyWithSpecial, 'REPLACED']])
    const input = 'value of my$var.name is here'
    const result = replaceVariablesWithWordBoundaries(input, map)
    assert.equal(result, 'value of REPLACED is here')
})

test('L5: replaceVariablesWithWordBoundaries anchors variable replacement with word boundaries', () => {
    const map = new Map<string, string>([
        ['url', 'UUID_URL'],
        ['name', 'UUID_NAME'],
    ])

    const input = 'const url = "{{ url }}"; const curl = 1; const viewDemoURL = 2; const name = "{{ name }}"; const username = 3;'
    const result = replaceVariablesWithWordBoundaries(input, map)

    // url should be replaced as a word, but not in curl or viewDemoURL
    assert.ok(result.includes('const UUID_URL = "{{ UUID_URL }}"'))
    assert.ok(result.includes('const curl = 1'))
    assert.ok(result.includes('const viewDemoURL = 2'))

    // name should be replaced as a word, but not in username
    assert.ok(result.includes('const UUID_NAME = "{{ UUID_NAME }}"'))
    assert.ok(result.includes('const username = 3'))
})
