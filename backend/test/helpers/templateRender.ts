import fs from 'node:fs'
import path from 'node:path'

import { compileString } from '../../src/common/utils/compileTemplate'

/*
 * Test-side replica of the README render pipeline.
 *
 * Mirrors the data assembly done by MainContent.tsx, the
 * /v1/template/:id/defaultBlocks endpoint and the /v1/template/:id/macros
 * endpoint; the actual compile step is the same compileString the backend's
 * /v1/template/compile route calls, so a template rendered here produces
 * byte-identical output to what a user sees.
 */

export interface TemplateVariable {
    name: string
    defaultValue?: unknown
    [key: string]: unknown
}

export interface TemplateBlockFunction {
    name: string
    function: string
    variables: TemplateVariable[]
    [key: string]: unknown
}

export interface TemplateBlocks {
    folder: string
    startupBlocks: string[]
    functions: TemplateBlockFunction[]
    [key: string]: unknown
}

// Default location of the seeded template data; TEMPLATE_PUBLIC_DIR allows
// rendering a baseline copy (e.g. git show HEAD:...) for snapshot generation.
export const PUBLIC_DIR = process.env.TEMPLATE_PUBLIC_DIR ?? path.join(__dirname, '..', '..', 'public')

export const listTemplateFolders = (publicDir: string = PUBLIC_DIR): string[] =>
    fs
        .readdirSync(publicDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()

const readJson = <T>(filePath: string): T => JSON.parse(fs.readFileSync(filePath, 'utf8')) as T

/*
 * Replicates backend TemplateController.getTemplateInitialisedComponentList:
 * resolves startupBlocks names to function entries, in startupBlocks order,
 * skipping names with no matching block.
 */
export const orderedStartupBlocks = (blocks: TemplateBlocks): TemplateBlockFunction[] =>
    blocks.startupBlocks
        .map((blockName) => blocks.functions.find((block) => block.function === blockName))
        .filter((block): block is TemplateBlockFunction => block !== undefined)

/*
 * Replicates backend TemplateController.getTemplateMacros: concatenates the
 * stored macro content for each requested block, in request order.
 */
export const concatenatedMacros = (orderedBlocks: TemplateBlockFunction[], macrosByFunction: Record<string, string>): string =>
    orderedBlocks.map((block) => macrosByFunction[block.function] ?? '').join('')

/*
 * Replicates the react-hook-form state produced by the Editor: every
 * variable of every rendered block registers under its (UUID) name with its
 * defaultValue.
 */
export const defaultVariables = (orderedBlocks: TemplateBlockFunction[]): Record<string, unknown> => {
    const variables: Record<string, unknown> = {}
    for (const block of orderedBlocks) {
        for (const variable of block.variables) {
            variables[variable.name] = variable.defaultValue
        }
    }
    return variables
}

/*
 * Renders one template folder to README markdown using only the committed
 * blocks.json and macros.json, exactly as the frontend would with untouched
 * default values.
 */
export const renderTemplate = (folder: string, publicDir: string = PUBLIC_DIR): string => {
    const folderPath = path.join(publicDir, folder)
    const blocks = readJson<TemplateBlocks>(path.join(folderPath, 'blocks.json'))
    const macrosByFunction = readJson<Record<string, string>>(path.join(folderPath, 'macros.json'))

    const orderedBlocks = orderedStartupBlocks(blocks)
    const macros = concatenatedMacros(orderedBlocks, macrosByFunction)
    const variables = defaultVariables(orderedBlocks)

    return compileString(macros, orderedBlocks, variables)
}

/*
 * Returns every deterministic identifier declared by a template's
 * blocks.json: startup block names, function names and variable names.
 */
export const templateIdentifiers = (blocks: TemplateBlocks): Set<string> => {
    const ids = new Set<string>(blocks.startupBlocks)
    for (const block of blocks.functions) {
        ids.add(block.function)
        for (const variable of block.variables) {
            ids.add(variable.name)
        }
    }
    return ids
}

/*
 * Removes nunjucks tags ({{ ... }}, {% ... %}, {# ... #}) so the remaining
 * text is plain prose. Used to detect identifiers that were substituted into
 * prose instead of template syntax.
 */
export const stripNunjucksTags = (content: string): string => content.replace(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g, '')
