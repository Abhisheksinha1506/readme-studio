import './env'

import { once } from 'node:events'
import { AddressInfo } from 'node:net'

import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

import { initTemplates } from '../../src/db'
import app from '../../src/server'

/**
 * Starts the Express app on a random port against a seeded in-memory MongoDB.
 *
 * @returns The base URL to send requests to and a `stop` function that releases the port and database.
 */
export const startTestApp = async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
    await initTemplates()

    const server = app.listen(0)
    await once(server, 'listening')
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`

    const stop = async () => {
        server.close()
        await mongoose.disconnect()
        await mongod.stop()
    }

    return { baseUrl, stop }
}
