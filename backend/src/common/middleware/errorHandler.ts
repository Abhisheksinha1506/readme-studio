import { ErrorRequestHandler, RequestHandler } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'

const unexpectedRequest: RequestHandler = (_req, res) => {
    res.sendStatus(StatusCodes.NOT_FOUND)
}

/**
 * Final error handler. Replies with the project's ServiceResponse shape.
 *
 * Client errors raised by middleware (for example a malformed JSON body) keep their 4xx status;
 * everything else becomes a 500. Only the generic reason phrase is sent, never the error message
 * or stack trace.
 */
// Express identifies error handlers by their four parameters, so `_next` must stay declared.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const respondWithError: ErrorRequestHandler = (err, _req, res, _next) => {
    res.locals.err = err

    const isClientError = Number.isInteger(err?.status) && err.status >= 400 && err.status < 500
    const statusCode: number = isClientError ? err.status : StatusCodes.INTERNAL_SERVER_ERROR

    res.status(statusCode).send(new ServiceResponse(ResponseStatus.Failed, getReasonPhrase(statusCode), null, statusCode))
}

export default () => [unexpectedRequest, respondWithError]
