const { createSingleton } = require('./runtime')

/**
 * The runtime singleton
 */
const runtime = createSingleton()

if (typeof global.runtime === 'undefined') {
  global.runtime = runtime
}

if (typeof global.skypager === 'undefined') {
  global.skypager = runtime
}

module.exports = runtime
