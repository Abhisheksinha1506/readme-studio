import assert from 'node:assert/strict'
import { test } from 'node:test'

import { assertUniqueNames, escapeRegExp, replaceVariablesWithWordBoundaries } from '../script/generate'
import type { FullTemplate } from '@/api/templates/template.model'

const baseTemplate: Omit<FullTemplate, 'functions'> = {
    title: 'Test',
    description: 'Test',
    author: { name: 'Test', url: { url: 'https://example.com', _type: 'Github' } },
    contributors: [],
    startupBlocks: [],
    image: 'https://example.com/image.png',
    dateCreated: new Date(),
    lastUpdated: new Date(),
    tags: [],
    featured: false,
    folder: 'test-template',
    pageType: 'ReadME',
}

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

test('assertUniqueNames throws when two variables in the same function share a name', () => {
    const data: FullTemplate = {
        ...baseTemplate,
        functions: [
            {
                name: 'Header',
                description: 'Header',
                function: 'header',
                folder: 'test-template',
                variables: [
                    { label: 'A', name: 'description', defaultValue: 'a', _type: 'input' },
                    { label: 'B', name: 'description', defaultValue: 'b', _type: 'input' },
                ],
            },
        ],
    }

    assert.throws(() => assertUniqueNames(data), /duplicate variable name "description"/i)
})

test('assertUniqueNames throws when two functions in the same template share a name', () => {
    const data: FullTemplate = {
        ...baseTemplate,
        functions: [
            { name: 'Header', description: 'Header', function: 'header', folder: 'test-template', variables: [] },
            { name: 'Header Again', description: 'Header Again', function: 'header', folder: 'test-template', variables: [] },
        ],
    }

    assert.throws(() => assertUniqueNames(data), /duplicate function name "header"/i)
})

test('assertUniqueNames does not throw for unique names', () => {
    const data: FullTemplate = {
        ...baseTemplate,
        functions: [
            {
                name: 'Header',
                description: 'Header',
                function: 'header',
                folder: 'test-template',
                variables: [
                    { label: 'A', name: 'title', defaultValue: 'a', _type: 'input' },
                    { label: 'B', name: 'subtitle', defaultValue: 'b', _type: 'input' },
                ],
            },
            { name: 'Footer', description: 'Footer', function: 'footer', folder: 'test-template', variables: [] },
        ],
    }

    assert.doesNotThrow(() => assertUniqueNames(data))
})
