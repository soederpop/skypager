import Directory from './directory'
import lodash from 'lodash'

const { keys, has, result } = lodash

const hide = (o, p, value, configurable) =>
  Object.defineProperty(o, p, { value, configurable, enumerable: false })

/**
 * @name createMockContext
 * @param {Object} object - an object whose keys will be members of the registry
 * @returns {Function} requireContext - a webpack require function with a keys() method on it
 */
export function createMockContext(object = {}) {
  const fn = key =>
    result(object, key, () => {
      throw new Error(`Module ${key} not found in mock context`)
    })

  return Object.assign(fn, {
    keys() {
      return keys(object)
    },
    resolve(key) {
      const resolved = has(object, key) && key

      if (resolved) {
        return resolved
      } else {
        throw new Error(`Module ${key} not found in mock context`)
      }
    },
  })
}

/**
 * @extends Directory
 */
export class ContextRegistry extends Directory {
  constructor(name, options = {}) {
    if (typeof name === 'object') {
      options = name
      name = options.name || (options.context && options.context.id)
    }

    const webpackContext = options.context || options.req || createMockContext()
    delete options.context
    delete options.req

    super(name, options)

    hide(
      this,
      'context',
      this.wrapContext(
        webpackContext,
        Object.assign({}, options, {
          namespace: this.keyNamespace,
        })
      )
    )

    if (options.auto !== false) {
      this.registerContextModules()
    }
  }

  get keyNamespace() {
    return this.options.keyNamespace || ''
  }

  get loaded() {
    this.registerContextModules()
    return this
  }

  isValidContext(obj) {
    return (
      typeof obj === 'function' &&
      typeof obj.keys === 'function' &&
      typeof obj.resolve === 'function'
    )
  }

  add(webpackContext, options = {}) {
    if (!this.isValidContext(webpackContext) && webpackContext.convertToRequireContext) {
      webpackContext = webpackContext.convertToRequireContext()
    }

    this.registerContextModules(
      this.wrapContext(webpackContext, Object.assign({}, this.options, options))
    )
  }

  registerContextModules(requireContext = this.context) {
    const map = requireContext.idsMappedToKeys

    requireContext.ids.forEach(id => {
      this.register(
        id,
        () => requireContext.load(id),
        Object.assign({ id }, requireContext.metaForKey(id), this.options)
      )
    })
  }

  wrapContext(webpackContext, options = {}) {
    return new RequireContext(webpackContext, Object.assign({}, this.options, options))
  }
}

export default ContextRegistry

export const create = (...args) => ContextRegistry.create(...args)

/**
 * Wraps a particular type of webpack require context with a custom
 * API for using the modules it contains for their intended purpose.
 */

export class RequireContext {
  /**
   * Wrap one of webpack's require.context objects in your own custom object to provide
   * a DSL for working with that group of modules.
   *
   * @param {Context} webpackRequireContext - the result of a require.context call made inside a webpack compilation
   * @param {Object} options
   * @param {String} options.prefix - a prefix that will be discarded when coming up with a humanized id for the module
   */
  constructor(webpackRequireContext, options = {}) {
    if (typeof webpackRequireContext !== 'function' && webpackRequireContext.asRequireContext) {
      webpackRequireContext = webpackRequireContext.asRequireContext
    }

    if (typeof webpackRequireContext !== 'function') {
      throw "You must pass a the output of webpack's require.context() call.  It should be a function which has a keys method that returns an array of module ids."
    }

    if (typeof webpackRequireContext.keys !== 'function') {
      throw "You must pass a the output of webpack's require.context() call.  It should be a function which has a keys method that returns an array of module ids."
    }

    hide(this, 'options', options)
    hide(this, 'req', webpackRequireContext)
  }

  metaForKey(id) {
    const key = this.idsMappedToKeys[id]

    return {
      id,
      key,
      resolved: this.req.resolve(key),
      sourceModule: this.sourceModule,
    }
  }

  get sourceModule() {
    return this.options.sourceModule || {}
  }

  load(id) {
    const key = this.idsMappedToKeys[id]
    return this.req(key)
  }

  // prefix the id
  get namespace() {
    return this.options.namespace || ''
  }

  // remove this value from the require context key
  get prefix() {
    return this.options.prefix ? this.options.prefix : ''
  }

  get keys() {
    return this.req.keys()
  }

  get resolved() {}

  get ids() {
    return Object.keys(this.idsMappedToKeys)
  }

  get idsMappedToKeys() {
    return this.keys.reduce((memo, key) => {
      const id = `${key
        .replace(/^\.\//, this.namespace)
        .replace(this.prefix, '')
        .replace(/\.\w+$/, '')}`

      return Object.assign(memo, { [id]: key })
    }, {})
  }
}
