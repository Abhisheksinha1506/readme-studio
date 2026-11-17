/*
 * Test environment for modules that load src/common/utils/env on import.
 * Import this file before any src module.
 */
process.env.NODE_ENV = 'prod'
process.env.PORT = '0'
process.env.MONGO_PRIVATE_URL = 'mongodb://127.0.0.1:0/unused'
