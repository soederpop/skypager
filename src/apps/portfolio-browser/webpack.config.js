const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const { name, version } = require('./package.json')
const { DefinePlugin } = require('webpack')
const SourceMapSupport = require('webpack-source-map-support')

process.env.DISABLE_ENV_INJECTION = true
const production = require('@skypager/webpack/config/webpack.config.prod')

const nodeConfig = merge.strategy({ entry: 'replace', node: 'replace', externals: 'replace' })(
  Object.assign({}, production, {
    plugins: production.plugins.filter(
      p =>
        !p.constructor ||
        (p.constructor &&
          p.constructor.name !== 'UglifyJsPlugin' &&
          p.constructor.name !== 'ManifestPlugin' &&
          p.constructor.name !== 'DefinePlugin' &&
          p.constructor.name !== 'HtmlWebpackPlugin')
    ),
  }),
  {
    name: 'node',
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
      process: false,
    },
    resolve: {
      alias: {
        runtime: path.resolve(__dirname, '..', '..', 'runtime', 'src'),
      },
    },
    externals: [
      nodeExternals({ modulesDir: path.resolve(__dirname, 'node_modules') }),
      nodeExternals({ modulesDir: path.resolve(__dirname, '..', '..', '..', 'node_modules') }),
    ],
    entry: {
      index: ['@babel/polyfill/noConflict', path.resolve(__dirname, 'src', 'index.js')],
    },
    plugins: [
      new DefinePlugin({
        __PACKAGE__: JSON.stringify({ name, version }),
      }),
      new SourceMapSupport(),
    ],
  }
)

const webConfig = merge.strategy({ entry: 'replace' })(production, {
  entry: {
    app: ['@babel/polyfill/noConflict', path.resolve(__dirname, 'src/launch.js')],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  externals: [
    {
      'prop-types': 'global PropTypes',
      react: 'global React',
      '@skypager/runtime': 'global skypager',
      '@skypager/web': 'global skypager',
      'react-dom': 'global ReactDOM',
      'react-router-dom': 'global ReactRouterDOM',
      'semantic-ui-react': 'global semanticUIReact',
    },
  ],
})

module.exports = [webConfig, nodeConfig]
