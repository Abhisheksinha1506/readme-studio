import fs from 'fs'
import { StatusCodes } from 'http-status-codes'

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'
import { DefaultBlockInput, IFunction, FullTemplateModel, MacroModel } from './template.model'

export default class TemplateController {
    public async getTemplateInitialisedComponentList(id: string): Promise<ServiceResponse<IFunction[] | null>> {
        try {
            if (!id || id === 'undefined') {
                return new ServiceResponse(ResponseStatus.Failed, 'ID was not provided in the query', null, StatusCodes.BAD_REQUEST)
            }

            const blockData = await FullTemplateModel.findOne({ folder: id })

            if (!blockData) {
                return new ServiceResponse(ResponseStatus.Failed, 'Template not found', null, StatusCodes.NOT_FOUND)
            }

            const indexData: string[] = blockData.startupBlocks

            // Resolve in startupBlocks order and skip names that have no matching block.
            const functions: IFunction[] = indexData
                .map((blockName: string) => blockData.functions.find((block: IFunction) => block.function === blockName))
                .filter((block): block is IFunction => block !== undefined)

            return new ServiceResponse<IFunction[]>(ResponseStatus.Success, 'Success', functions, StatusCodes.OK)
        } catch (ex) {
            return new ServiceResponse(ResponseStatus.Failed, 'Failed to get template', null, StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    public async getTemplateMacros(body: DefaultBlockInput[]): Promise<ServiceResponse<string | null>> {
        try {
            // An empty $or is rejected by MongoDB, so an empty request is answered directly.
            if (!body.length) {
                return new ServiceResponse<string>(ResponseStatus.Success, 'Success', '', StatusCodes.OK)
            }

            const macroKey = (folder: string, name: string) => JSON.stringify([folder, name])

            const storedMacros = await MacroModel.find({ $or: body.map(({ folder, function: name }) => ({ folder, name })) })
            const contentByKey = new Map(storedMacros.map((macro) => [macroKey(macro.folder, macro.name), macro.content]))

            // Concatenate in request order; blocks without a stored macro contribute nothing.
            const macros = body.map(({ folder, function: name }) => contentByKey.get(macroKey(folder, name)) ?? '').join('')

            return new ServiceResponse<string>(ResponseStatus.Success, 'Success', macros, StatusCodes.OK)
        } catch (ex) {
            return new ServiceResponse(ResponseStatus.Failed, 'Failed to get template macros', null, StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    public async getTemplatePreview(id: string): Promise<ServiceResponse<string | null>> {
        try {
            if (!id || id == 'undefined') return new ServiceResponse(ResponseStatus.Success, 'Success', '', StatusCodes.OK)

            const filePath = `./public/${id}/preview.md`
            if (!fs.existsSync(filePath)) {
                return new ServiceResponse(ResponseStatus.Failed, 'Preview not found', null, StatusCodes.NOT_FOUND)
            }
            const previewData: string = fs.readFileSync(filePath, 'utf8')

            return new ServiceResponse<string>(ResponseStatus.Success, 'Success', previewData, StatusCodes.OK)
        } catch (ex) {
            return new ServiceResponse(ResponseStatus.Failed, 'Failed to get template preview', null, StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}

