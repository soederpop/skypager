const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const cwd = __dirname
const path = require('path')
const { DefinePlugin } = require('webpack')
const { name, version } = require('./package.json')

process.env.MINIFY = true
const baseProdConfig = require('@skypager/webpack/config/webpack.config.prod')

const webConfig = merge.strategy({
  externals: 'replace',
  plugins: 'replace',
  entry: 'replace',
  node: 'replace',
})(baseProdConfig, {
  name: 'web',
  target: 'web',
  node: {
    process: false,
    global: false,
    vm: false,
  },
  output: {
    path: path.join(__dirname, 'build'),
  },
  resolve: {
    alias: {
      vm: 'vm-browserify',
    },
  },
  entry: {
    'page-models-registry': [
      'expose-loader?lodash!lodash',
      path.resolve(cwd, 'src', 'examples', 'page-models-registry', 'index.js'),
    ],
  },
  externals: [
    {
      lodash: 'global lodash',
    },
  ],
  plugins: baseProdConfig.plugins
    .filter(p => !p.constructor || !p.constructor.name === 'UglifyJsPlugin')
    .concat([
      new DefinePlugin({
        __PACKAGE__: JSON.stringify({ name, version }),
      }),
    ]),
})

webConfig.module.rules[0].include.push(
  path.dirname(require.resolve('@skypager/runtime/src/index.js'))
)

module.exports = webConfig
