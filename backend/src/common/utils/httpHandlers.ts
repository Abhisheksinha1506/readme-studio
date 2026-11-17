import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError, ZodSchema } from 'zod'

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
    return response.status(serviceResponse.statusCode).send(serviceResponse)
}

/**
 * Marks a GET response as publicly cacheable for `seconds`.
 *
 * Template data is seeded once at backend boot (see db.ts's initTemplates)
 * and only changes on redeploy, so a short cache window cuts repeat reads
 * without risking long-lived staleness.
 *
 * @param seconds How long a cache may reuse the response without revalidating.
 */
export const cacheFor = (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', `public, max-age=${seconds}`)
    next()
}

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next()
    } catch (err) {
        const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`
        const statusCode = StatusCodes.BAD_REQUEST
        res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode))
    }
}
