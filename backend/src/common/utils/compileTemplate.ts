/*
 * The Nunjucks compile pipeline for turning a template's macros, selected
 * blocks and variable values into a rendered README.
 *
 * This used to live only in the frontend (components/GenerateTemplate/
 * MainContent/generator.ts), compiled client-side via nunjucks/browser.
 * It's promoted here so the backend can render on the user's behalf
 * instead, with one implementation instead of two that could drift apart.
 *
 * SECURITY: `macros` and every `function`/variable `name` in `templateBlocks`
 * are concatenated directly into Nunjucks template source and executed by
 * nunjucks.renderString. Nunjucks has no sandbox: template source is
 * effectively arbitrary code. The client-side version was safe because it
 * ran in the user's own browser against their own input (self-XSS at worst).
 * On the server, these three inputs MUST come only from a template's
 * committed blocks.json/macros.json (via Mongo), never from request input —
 * see TemplateController.compileTemplate, the only production caller, which
 * resolves them from the database before calling compileString. Variable
 * *values* are safe to take from the client: they're passed as the render
 * context object, never parsed as template source.
 */

import nunjucks from 'nunjucks'

export interface CompileTemplateVariable {
    name: string
    [key: string]: unknown
}

export interface CompileTemplateBlock {
    function: string
    variables: CompileTemplateVariable[]
    [key: string]: unknown
}

export const combineMacroIntoOrderedFunctionString = (blocks: CompileTemplateBlock[]): string =>
    blocks
        .map((func) => {
            const variableArray: string[] = func.variables.map((variable) => variable.name)
            return `{{- ${func.function}(${variableArray.join(', ')}) -}}`
        })
        .join(' ')

/**
 * Renders a README from already-fetched macro definitions, the ordered list
 * of selected blocks, and the current value of every variable.
 *
 * `macros` and every block's `function`/variable `name` must be trusted
 * (DB-sourced) identifiers, not request input — see the security note above.
 * `variables` is passed as the Nunjucks render context, so its keys and
 * values are never parsed as template source and may safely come from the
 * client.
 *
 * @param macros Concatenated Nunjucks macro definitions for the selected blocks.
 * @param templateBlocks The selected blocks, in render order.
 * @param variables Current value of every variable, keyed by variable name.
 * @return The rendered README markdown.
 */
export const compileString = (macros: string, templateBlocks: CompileTemplateBlock[], variables: Record<string, unknown>): string => {
    nunjucks.configure({ autoescape: false, lstripBlocks: true })

    const index = combineMacroIntoOrderedFunctionString(templateBlocks)
    const string = `${macros} ${index}`

    return nunjucks.renderString(string, variables)
}
