/*
 * The Nunjucks compile pipeline for turning a template's macros, selected
 * blocks and variable values into a rendered README.
 *
 * This used to live only in the frontend (components/GenerateTemplate/
 * MainContent/generator.ts), compiled client-side via nunjucks/browser.
 * It's promoted here so the backend can render on the user's behalf
 * instead, with one implementation instead of two that could drift apart.
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

export const mapVariableObjectToString = (variables: Record<string, unknown>): string => {
    let variablesString = ''
    Object.keys(variables).forEach((element: string) => {
        variablesString += `{%- set ${element} = ${JSON.stringify(variables[element])} -%} `
    })
    return variablesString
}

/**
 * Renders a README from already-fetched macro definitions, the ordered list
 * of selected blocks, and the current value of every variable.
 *
 * @param macros Concatenated Nunjucks macro definitions for the selected blocks.
 * @param templateBlocks The selected blocks, in render order.
 * @param variables Current value of every variable, keyed by variable name.
 * @return The rendered README markdown.
 */
export const compileString = (macros: string, templateBlocks: CompileTemplateBlock[], variables: Record<string, unknown>): string => {
    nunjucks.configure({ autoescape: false, lstripBlocks: true })

    const specificTemplate = macros
    const index = combineMacroIntoOrderedFunctionString(templateBlocks)
    const variableString = mapVariableObjectToString(variables)

    const string = `${variableString} ${specificTemplate} ${index}`
    return nunjucks.renderString(string, {})
}
