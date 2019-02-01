const runtime = require('@skypager/runtime').use(require('@skypager/helpers-client'))

runtime.features.add(require.context('./features', true, /\.js$/))

runtime.use('asset-loaders')

if (typeof __PACKAGE__ !== 'undefined') {
  // eslint-disable-next-line
  runtime.hide('runtimePackageInfo', __PACKAGE__, true)
}

module.exports = runtime
