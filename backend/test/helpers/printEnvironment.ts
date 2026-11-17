/*
 * Probe run in a child process by env.test.ts: loads the env module and prints the resolved mode.
 */
import { PRODUCTION_OR_DEVELOPMENT } from '../../src/common/utils/env'

console.log(`mode=${PRODUCTION_OR_DEVELOPMENT}`)
