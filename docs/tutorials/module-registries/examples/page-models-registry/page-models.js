import { Context as Registry } from '@skypager/runtime/lib/registries/context'
import * as HomePage from './pages/HomePage'
import * as AboutPage from './pages/AboutPage'
/**
 * @typedef PageModelProvider
 * @type {Object}
 * @property {Object} pageSelectors - an object of css selectors
 * @property {String} path - a route pattern for the pages path
 * @property {Array} pageMethods - a list of function names
 */

/**
 * @typedef RequireContext
 * @type {Function}
 * @param {Function} keys - a function which returns the keys for each module in the require.context
 */

/**
 * @typedef RegistryOptions
 * @type {Object}
 * @param {Function} wrapper - a function which will be called with the module.exports, and the id, before returning it to lookup
 * @param {RequireContext} context - the webpack require context
 */

/**
 * @name PageModels
 * @extends Registry
 */
export class PageModels extends Registry {
  /**
   * @param {String} name - the name of the registry
   * @param {RegistryOptions} options - registry options
   */
  constructor(name, options = {}) {
    super(name, options)
  }

  async discover() {
    return 'discovering'
  }
}

/**
 * @name PageModel
 */
export class PageModel {
  /**
   *
   * @param {Object} options
   * @param {String} options.name
   * @param {PageModelProvider} options.provider - the page model implementation provider
   */
  constructor(options) {
    /* @type PageModelProvider */
    this.provider = options.provider
    this.name = options.name
  }

  get selectors() {
    const { provider } = this
    const { pageSelectors = {} } = provider
    return pageSelectors
  }
}

export const pageModels = new PageModels('pageModels', {
  wrapper: (provider = {}, name) => new PageModel({ name, provider }),
})

pageModels.register('HomePage', () => HomePage)
pageModels.register('AboutPage', () => AboutPage)
