import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import type { TemplateBlocks } from './helpers/templateRender'
import { PUBLIC_DIR, listTemplateFolders, renderTemplate, stripNunjucksTags, templateIdentifiers } from './helpers/templateRender'

const BACKEND_ROOT = path.join(__dirname, '..')
const SNAPSHOT_DIR = path.join(__dirname, 'fixtures', 'snapshots')
const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === '1'

const readJson = <T>(filePath: string): T => JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

/*
 * Regression snapshots: renders every template in backend/public with default
 * variable values through the same Nunjucks pipeline the frontend uses, and
 * compares against committed snapshots. Regenerating blocks.json/macros.json
 * (yarn generate) must not change the rendered README.
 */
for (const folder of listTemplateFolders()) {
    test(`render snapshot: ${folder}`, () => {
        const rendered = renderTemplate(folder)
        const snapshotPath = path.join(SNAPSHOT_DIR, `${folder}.md`)

        if (UPDATE_SNAPSHOTS) {
            fs.mkdirSync(SNAPSHOT_DIR, { recursive: true })
            fs.writeFileSync(snapshotPath, rendered)
            return
        }

        assert.ok(fs.existsSync(snapshotPath), `Missing snapshot ${snapshotPath}; run with UPDATE_SNAPSHOTS=1 to create it`)
        assert.equal(rendered, fs.readFileSync(snapshotPath, 'utf8'), `Rendered README for ${folder} differs from snapshot`)
    })
}

/*
 * `yarn generate` (tsx script/generate.ts) must be idempotent: after two
 * consecutive runs over already-generated output, `git status` on the
 * generated files must be clean — i.e. the second run leaves an empty diff.
 */
test('yarn generate is idempotent (second run leaves an empty git diff)', () => {
    const runGenerate = () => {
        const tsxBin = path.join(BACKEND_ROOT, 'node_modules', '.bin', 'tsx')
        execFileSync(tsxBin, ['script/generate.ts'], { cwd: BACKEND_ROOT, stdio: 'pipe' })
    }

    const dirtyGeneratedFiles = () =>
        execFileSync('git', ['status', '--porcelain', '--', 'public/'], { cwd: BACKEND_ROOT, encoding: 'utf8' }).trim()

    runGenerate()
    runGenerate()

    assert.equal(dirtyGeneratedFiles(), '', 'yarn generate left uncommitted changes in backend/public after the second run')
})

/*
 * Word-boundary replacement in script/generate.ts must only substitute
 * identifiers inside nunjucks syntax. Any template identifier (function or
 * variable UUID) surviving in plain prose means an original variable name
 * matched prose text and was wrongly replaced.
 */
test('no template identifier appears in plain prose of macros.json', () => {
    const suspicious: { folder: string; macro: string; identifier: string; excerpt: string }[] = []

    for (const folder of listTemplateFolders()) {
        const folderPath = path.join(PUBLIC_DIR, folder)
        const blocks = readJson<TemplateBlocks>(path.join(folderPath, 'blocks.json'))
        const macrosByFunction = readJson<Record<string, string>>(path.join(folderPath, 'macros.json'))
        const identifiers = templateIdentifiers(blocks)

        for (const [macroName, content] of Object.entries(macrosByFunction)) {
            const prose = stripNunjucksTags(content)
            for (const identifier of identifiers) {
                const index = prose.indexOf(identifier)
                if (index !== -1) {
                    suspicious.push({
                        folder,
                        macro: macroName,
                        identifier,
                        excerpt: prose.slice(Math.max(0, index - 40), index + identifier.length + 40),
                    })
                }
            }
        }
    }

    assert.equal(suspicious.length, 0, `Identifiers found in macro prose:\n${JSON.stringify(suspicious, null, 2)}`)
})
