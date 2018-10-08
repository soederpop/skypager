export const shortcut = 'assetLoader'

export const featureMethods = ['image', 'stylesheet', 'script', 'css', 'lazyInject']

export function image(url, options = {}) {
  return this.inject.img(url, options)
}

export function css(url, options = {}) {
  return this.inject.css(url, options)
}

export function stylesheet(url, options = {}) {
  return this.inject.css(url, options)
}

export function script(url, options = {}) {
  return this.inject.js(url, options)
}

export function lazyInject() {
  // Function which returns a function: https://davidwalsh.name/javascript-functions
  function _load(tag) {
    return function(url, options = {}) {
      // This promise will be used by Promise.all to determine success or failure
      return new Promise(function(resolve, reject) {
        var element = document.createElement(tag)
        var parent = 'body'
        var attr = 'src'

        // Important success and error for the promise
        element.onload = function() {
          resolve(url)
        }
        element.onerror = function() {
          reject(url)
        }

        // Need to set different attributes depending on tag type
        switch (tag) {
          case 'script':
            element.async = true
            if (options.babel) {
              element.type = 'text/babel'
              element['data-presets'] = 'es2015,stage-2,react'
            }
            break
          case 'link':
            element.type = 'text/css'
            element.rel = 'stylesheet'
            attr = 'href'
            parent = 'head'
        }

        // Inject into document to kick off loading
        element[attr] = url
        console.log('appending', element, document[parent])
        const result = document[parent].appendChild(element)
        console.log(result)
      })
    }
  }

  return {
    css: _load('link'),
    js: _load('script'),
    img: _load('img'),
  }
}
