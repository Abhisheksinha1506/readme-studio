import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError, ZodSchema } from 'zod'

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
    return response.status(serviceResponse.statusCode).send(serviceResponse)
}

/**
 * Marks a successful GET response as publicly cacheable for `seconds`.
 *
 * Template data is seeded once at backend boot (see db.ts's initTemplates)
 * and only changes on redeploy, so a short cache window cuts repeat reads
 * without risking long-lived staleness.
 *
 * Only applies the header once the status code is known to be 2xx: the
 * route's status isn't set until the handler runs, so the header is attached
 * by wrapping `send` rather than set upfront, which would also mark error
 * responses (404, 500) as cacheable.
 *
 * @param seconds How long a cache may reuse the response without revalidating.
 */
export const cacheFor = (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res)
    res.send = ((body?: unknown) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            res.set('Cache-Control', `public, max-age=${seconds}`)
        }
        return originalSend(body)
    }) as Response['send']
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
