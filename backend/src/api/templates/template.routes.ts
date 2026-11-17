import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { Request, Response, Router } from 'express'
import { z } from 'zod'

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { commonValidations } from '@/common/utils/commonValidation'
import { cacheFor, handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers'

const TEMPLATE_DATA_CACHE_SECONDS = 300

import {
    CompileTemplateInput,
    CompileTemplateInputSchema,
    DefaultBlockInput,
    DefaultBlockInputSchema,
    FullTemplateSchema,
    FunctionSchema,
    ObjectSchema,
    PageTypeSchema,
    SideBarOptionsSchema,
    TagSchema,
    TemplateSchema,
    URLTypeSchema,
    UserSchema,
    VariableCheckBoxSchema,
    VariableInputSchema,
    VariableListSchema,
    VariableObjectSchema,
    VariableRadioSchema,
    VariableSchema,
    VariableSelectSchema,
    VariableTextAreaSchema,
    VariableTypeSchema,
} from './template.model'
import TemplateController from './template.controller'

export const templateRegistry = new OpenAPIRegistry()

templateRegistry.register('IUser', UserSchema)
templateRegistry.register('ITemplate', TemplateSchema)
templateRegistry.register('IFunction', FunctionSchema)
templateRegistry.register('IFullTemplate', FullTemplateSchema)
templateRegistry.register('IVariable', VariableSchema)
templateRegistry.register('IObject', ObjectSchema)

templateRegistry.register('IVariableType', VariableTypeSchema)
templateRegistry.register('IVariableInput', VariableInputSchema)
templateRegistry.register('IVariableTextArea', VariableTextAreaSchema)
templateRegistry.register('IVariableCheckBox', VariableCheckBoxSchema)
templateRegistry.register('IVariableList', VariableListSchema)
templateRegistry.register('IVariableObject', VariableObjectSchema)
templateRegistry.register('IVariableSelect', VariableSelectSchema)
templateRegistry.register('IVariableRadio', VariableRadioSchema)

templateRegistry.register('ITag', TagSchema)
templateRegistry.register('IURLType', URLTypeSchema)
templateRegistry.register('ISideBarOptions', SideBarOptionsSchema)
templateRegistry.register('IPageType', PageTypeSchema)

templateRegistry.register('IDefaultBlockInput', DefaultBlockInputSchema)
templateRegistry.register('ICompileTemplateInput', CompileTemplateInputSchema)

const TemplateIdRequestSchema = z.object({ params: z.object({ id: commonValidations.templateFolder }) })

const MAX_MACROS_PER_REQUEST = 100
const MacrosRequestSchema = z.object({ body: z.array(DefaultBlockInputSchema).max(MAX_MACROS_PER_REQUEST) })

const CompileRequestSchema = z.object({
    body: CompileTemplateInputSchema.extend({
        blocks: CompileTemplateInputSchema.shape.blocks.max(MAX_MACROS_PER_REQUEST),
    }),
})

export const templateController: Router = (() => {
    const router = express.Router()

    templateRegistry.registerPath({
        method: 'get',
        path: '/v1/template/template/{id}/defaultBlocks',
        tags: ['Template'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: createApiResponse(z.array(FunctionSchema), 'Success'),
    })

    router.get('/template/:id/defaultBlocks', validateRequest(TemplateIdRequestSchema), cacheFor(TEMPLATE_DATA_CACHE_SECONDS), async (req: Request, res: Response) => {
        const controller = new TemplateController()
        const serviceResponse = await controller.getTemplateInitialisedComponentList(req.params.id)

        handleServiceResponse(serviceResponse, res)
    })

    templateRegistry.registerPath({
        method: 'post',
        path: '/v1/template/template/{id}/macros',
        tags: ['Template'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/IDefaultBlockInput',
                        },
                    },
                },
            },
        },
        responses: createApiResponse(z.string(), 'Success'),
    })

    router.post('/template/:id/macros', validateRequest(MacrosRequestSchema), async (req: Request, res: Response) => {
        const body: DefaultBlockInput[] = req.body as DefaultBlockInput[]

        const controller = new TemplateController()
        const serviceResponse = await controller.getTemplateMacros(body)

        handleServiceResponse(serviceResponse, res)
    })

    templateRegistry.registerPath({
        method: 'get',
        path: '/v1/template/template/{id}/preview',
        tags: ['Template'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: createApiResponse(z.string(), 'Success'),
    })

    router.get('/template/:id/preview', validateRequest(TemplateIdRequestSchema), cacheFor(TEMPLATE_DATA_CACHE_SECONDS), async (req: Request, res: Response) => {
        const controller = new TemplateController()
        const serviceResponse = await controller.getTemplatePreview(req.params.id)

        handleServiceResponse(serviceResponse, res)
    })

    templateRegistry.registerPath({
        method: 'post',
        path: '/v1/template/compile',
        tags: ['Template'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ICompileTemplateInput',
                    },
                },
            },
        },
        responses: createApiResponse(z.string(), 'Success'),
    })

    router.post('/compile', validateRequest(CompileRequestSchema), async (req: Request, res: Response) => {
        const body: CompileTemplateInput = req.body as CompileTemplateInput

        const controller = new TemplateController()
        const serviceResponse = await controller.compileTemplate(body)

        handleServiceResponse(serviceResponse, res)
    })

    return router
})()
