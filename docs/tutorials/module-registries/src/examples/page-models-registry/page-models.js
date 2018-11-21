import ContextRegistry from '@skypager/runtime/lib/registries/context'
import { createMockContext } from '@skypager/runtime/lib/registries/context'
import * as HomePage from './pages/HomePage'
import * as AboutPage from './pages/AboutPage'
import lodash from 'lodash'
/**

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
 * @extends ContextRegistry
 */
export class PageModels extends ContextRegistry {
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
   * @param {String} options.name - the name of the page model
   * @param {Object} options.provider - the page model implementation provider
   * @param {Object} options.provider.pageSelectors - an object of css selectors
   * @param {String} options.provider.pageSelectors.main - the main css selector for the page, should be an id
   * @param {String} options.provider.path - a route pattern for the pages path
   * @param {Array} [options.provider.pageMethods] - a list of function names
   */
  constructor(options) {
    /* @type PageModelProvider */
    this.provider = options.provider
    this.name = options.name || this.constructor.name
  }

  get route() {
    return this.provider.path
  }

  get selectors() {
    const { provider } = this
    const { pageSelectors = {} } = provider
    return pageSelectors
  }
}

export const pageModelsApi = {
  findByRoute(route) {
    return lodash.entries(this.allMembers()).filter(([id, pageModel]) => pageModel.route === route)
  },
}
export const pageModels = new PageModels('pageModels', {
  wrapper: (provider = {}, name) => new PageModel({ name, provider }),
  context: createMockContext(),
  api: pageModelsApi,
})

pageModels.register('HomePage', () => HomePage)
pageModels.register('AboutPage', () => AboutPage)
