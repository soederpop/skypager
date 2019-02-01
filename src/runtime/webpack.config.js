const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const cwd = __dirname
const path = require('path')
const SourceMapSupport = require('webpack-source-map-support')

const orig = process.env.MINIFY
process.env.MINIFY = true
const baseProductionConfig = require('@skypager/webpack/config/webpack.config.prod')
const baseCommonConfig = require('@skypager/webpack/config/webpack.config.common')
process.env.MINIFY = orig || false

const lodashImports = require('./lodash-imports.json')

const minifiedWebConfig = merge.strategy({ node: 'replace', entry: 'replace' })(
  baseProductionConfig,
  {
    name: 'web',
    node: {
      process: 'mock',
      global: false,
    },
    output: {
      library: 'skypager',
      libraryTarget: 'umd',
    },
    externals: [
      {
        lodash: {
          var: 'global lodash',
          commonjs2: 'lodash',
          commonjs: 'lodash',
        },
      },
    ],
    resolve: {
      alias: {
        mobx: path.resolve(cwd, 'src', 'mobx.umd.min.js'),
        vm: 'vm-browserify',
      },
    },
    entry: {
      'skypager-runtime.min': [
        '@babel/polyfill/noConflict',
        path.resolve(cwd, 'src', 'global.polyfills'),
        'expose-loader?lodash!lodash/lodash.min.js',
        path.resolve(cwd, 'src', 'index.web.js'),
      ],
    },
  }
)

const webConfig = merge.strategy({ node: 'replace', entry: 'replace', plugins: 'replace' })(
  baseProductionConfig,
  {
    name: 'web',
    node: {
      process: 'mock',
      global: false,
    },
    output: {
      library: 'skypager',
      libraryTarget: 'umd',
    },
    externals: [
      {
        lodash: {
          var: 'global lodash',
          commonjs2: 'lodash',
          commonjs: 'lodash',
        },
      },
    ],
    resolve: {
      alias: {
        mobx: path.resolve(cwd, 'src', 'mobx.umd.min.js'),
        vm: 'vm-browserify',
      },
    },
    entry: {
      'skypager-runtime': [
        '@babel/polyfill/noConflict',
        path.resolve(cwd, 'src', 'global.polyfills'),
        'expose-loader?lodash!lodash/lodash.min.js',
        path.resolve(cwd, 'src', 'index.web.js'),
      ],
    },
    plugins: baseProductionConfig.plugins.filter(
      p => !p.constructor || !p.constructor.name === 'UglifyJsPlugin'
    ),
  }
)

module.exports = process.env.ANALYZE ? webConfig : [webConfig, minifiedWebConfig]
