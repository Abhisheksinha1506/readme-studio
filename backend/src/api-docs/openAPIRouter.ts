import express, { Request, Response, Router } from 'express'
import swaggerUi from 'swagger-ui-express'

import { generateOpenAPIDocument } from '@/api-docs/openAPIDocumentGenerator'

export const openAPIRouter: Router = (() => {
    const router = express.Router()
    const openAPIDocument = generateOpenAPIDocument()

    router.get('/swagger.json', (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(openAPIDocument)
    })

    // Serve the UI only at the root so unmatched paths fall through to the 404 handler.
    router.use(swaggerUi.serve)
    router.get('/', swaggerUi.setup(openAPIDocument))

    return router
})()
