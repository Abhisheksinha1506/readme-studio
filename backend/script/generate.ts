import * as fs from 'fs'
import * as path from 'path'
import { v5 as uuidv5 } from 'uuid'
import { FullTemplate, IFunction, Variable, VariableObjectSchema } from '../src/api/templates/template.model'

export const UUID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

export function getDeterministicUUID(name: string, namespace: string = UUID_NAMESPACE): string {
    return uuidv5(name, namespace).replaceAll('-', '')
}

// Read directories and processes blocks.ts files
export const readDirectoriesAndConvertToJSON = async (directoryPath: string) => {
    const directory: string = path.join(directoryPath, 'public')

    const files = fs.readdirSync(directory)
    for (const file of files) {
        const filePath = path.join(directory, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
            const variableToUUIDMap: Map<string, string> | undefined = await generateBlockJSON(filePath)

            if (!variableToUUIDMap) {
                continue
            }

            generateMacroJSON(filePath, variableToUUIDMap)
        }
    }
}

const generateBlockJSON = async (directoryPath: string): Promise<Map<string, string> | undefined> => {
    // Check if block.ts file exists
    let blocksFilePath: string = path.join(directoryPath, 'blocks.ts')
    const doesBlockFileExist: boolean = fs.existsSync(blocksFilePath)

    if (!doesBlockFileExist) {
        console.error('blocks.ts file does not exist in the directory: ', directoryPath)
        return
    }

    // if windows, we have to add file:// to the path
    if (process.platform === 'win32') {
        blocksFilePath = 'file://' + blocksFilePath
    }

    const variableToUUIDMap: Map<string, string> = new Map()

    const importedData = await import(blocksFilePath)
    const data: FullTemplate = importedData.default

    assertUniqueNames(data)

    data.functions.forEach((func: IFunction) => {
        // Update the macros name
        const functionUUID = getDeterministicUUID(`${data.folder}:${func.function}`)
        variableToUUIDMap.set(func.function, functionUUID)
        func.function = functionUUID

        func.variables.forEach((variable: Variable) => {
            const variableUUID = getDeterministicUUID(`${data.folder}:${func.function}:${variable.name}`)
            variableToUUIDMap.set(variable.name, variableUUID)
            variable.name = variableUUID
        })
    })

    data.startupBlocks = data.startupBlocks.map((element) => variableToUUIDMap.get(element)!)

    fs.writeFileSync(path.join(directoryPath, 'blocks.json'), JSON.stringify(data))

    return variableToUUIDMap
}

/**
 * Guards against two functions, or two variables within one function, sharing
 * a name in a template's source.
 *
 * `generateBlockJSON` derives each id deterministically from its name, so a
 * duplicate name produces the identical id for both entries: the second
 * silently overwrites the first in the UUID map, and both render as the same
 * Nunjucks variable, clobbering whichever value gets set last.
 *
 * @param data The template as authored in blocks.ts, before id generation.
 * @throws When a function name or a variable name repeats within the template.
 */
export function assertUniqueNames(data: FullTemplate): void {
    const functionNames = new Set<string>()

    data.functions.forEach((func) => {
        if (functionNames.has(func.function)) {
            throw new Error(`Duplicate function name "${func.function}" in template "${data.folder}"`)
        }
        functionNames.add(func.function)

        const variableNames = new Set<string>()
        func.variables.forEach((variable) => {
            if (variableNames.has(variable.name)) {
                throw new Error(`Duplicate variable name "${variable.name}" in function "${func.function}" of template "${data.folder}"`)
            }
            variableNames.add(variable.name)
        })
    })
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function replaceVariablesWithWordBoundaries(content: string, variableToUUIDMap: Map<string, string>): string {
    let data = content
    Array.from(variableToUUIDMap).forEach(([key, value]) => {
        const escapedKey = escapeRegExp(key)
        data = data.replace(new RegExp(`\\b${escapedKey}\\b`, 'g'), value)
        console.log('replacing', key, value)
    })
    return data
}

function generateMacroJSON(directoryUrl: string, variableToUUIDMap: Map<string, string>): void {
    const macrosDirectory = path.join(directoryUrl, 'macros')

    const filesList: string[] = fs.readdirSync(macrosDirectory)
    const result: { [key: string]: string } = {}

    for (const file of filesList) {
        const filePath = path.join(macrosDirectory, file)
        if (fs.lstatSync(filePath).isFile()) {
            let data = fs.readFileSync(filePath, { encoding: 'utf8' })

            data = replaceVariablesWithWordBoundaries(data, variableToUUIDMap)

            result[variableToUUIDMap.get(file.replace('.njk', ''))!] = data
        }
    }

    const outputFile = path.join(directoryUrl, 'macros.json')

    fs.writeFileSync(outputFile, JSON.stringify(result))
}

const rootDirectory: string = path.join(__dirname, '..')
if (require.main === module) {
    readDirectoriesAndConvertToJSON(rootDirectory)
}
