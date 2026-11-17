import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import { listTemplateFolders, renderTemplate } from './helpers/templateRender'

const SNAPSHOT_DIR = path.join(__dirname, 'fixtures', 'snapshots')
const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === '1'

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
