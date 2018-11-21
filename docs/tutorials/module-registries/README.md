# Introduction to Module Registries

If you've ever written node.js javascript, you've already worked with a registry.

Run the following command to start an interactive REPL

```shell
$ skypager console
```

Type the following command:

```javascript
require.cache
```

You will see an Object, keyed by absolute paths on your file system.  

The values are node's actual module object.

```javascript
Module {
  id: '~/node_modules/lodash/index.js',
  exports: function lodash() { },
  filename: '~/node_modules/lodash/index.js',
  loaded: true,
  parent: Module { ... },
  paths: [],
  children: []
}
```

In node, when you require a module, here is a rough outline of what's happening.  Lets say you have a file

```javascript
// my-app.js
const app = require('./app.js')
module.exports = { app }
```

From the perspective of node, here is what happens when somebody `require('./my-app.js')` 

First it calls `require.resolve('./my-app.js')` which gives us the absolute path to the file.

Then it looks in `require.cache[pathToMyApp]` and if a module has already been required, returns that.  If it does not.

Then it looks in `require.extensions` for a handler for the file type. For JS files this produces:

```javascript
(function (exports, require, module, __filename, __dirname) {
  const app = require('./app.js')
  module.exports = { app }
})
```

This creates a function, which will automatically have variables in module scope like 

`require`
`module`
`exports`
`__dirname`
`__filename`

and then it runs that function.  

When you write `module.exports = 1` you are mutating the module object that was passed to this wrapped function.

require returns whatever is set on `module.exports`

This can be summarized as 

- require(userRequest)
-   resolve(userRequest)
-   checkCache(resolvedRequest)
-     onHit -> return module
-     onMiss -> 
-        load raw script
-        wrap raw script 
-        run wrapped code
-        write to cache
-        return exports


## Skypager Registries 

Node's `require.cache` is the language level module registry.  

Skypager's Registry classes let us develop domain level module registries, which 
provided similar functionality to node's require, but for specific collections of modules.

It is very common that modules which live inside `src/pages` all have a select few things in common,
and that modules which live inside `src/features` have things in common with eachother. 

```javascript
const { Context: Registry } = require('@skypager/runtime/lib/registries') 

class PageModels extends Registry { 
  async discover() {
    return 'discovering'
  }
}

class PageModel {
  constructor({ provider }) {
    this.provider = provider
  }

  get selectors() {
    const { provider } = this
    const { pageSelectors = {} } = provider
    return pageSelectors
  }
}

const pageModels = new PageModels('pageModels', {
  wrapper: (provider = {}, name) => new PageModel({ name, provider })
})
```

In this example, we create a new class `PageModels` and extend from the [Skypager Context Registry](../src/runtime/src/registries/context.js)

The instance of this registry `pageModels` a few important methods:

- `register(id, () => moduleExports)`
- `lookup(id)`
- `available // => [id1, id2, id3]`
- `checkKey(id) //=> id or false if not in there` 
- `add(requireContext)`

This particular type of registry works very well with webpack's `require.context` feature. 

In the example below, we automatically register every module in the pages folder, without going into subfolders, if they end in .js

```javascript
pageModels.add(
  require.context('./pages', false, /\.js$/)
)
```








