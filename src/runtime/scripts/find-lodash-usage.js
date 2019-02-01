import runtime from '@skypager/node'
import * as docs from '@skypager/helpers-document'
import babelConfig from '@skypager/helpers-document/src/babel/babel-config'

runtime.use(docs)

async function main() {
  await runtime.scripts.discover({
    defaults: {
      babelConfig: babelConfig({
        presetEnv: {
          modules: 'auto',
        },
      }),
    },
  })

  const allScripts = runtime.scripts.available.map(id => runtime.script(id))

  console.log('Parsing Scripts')
  await Promise.all(
    allScripts.map(script => {
      return script.parse()
    })
  )

  const final = {}

  allScripts.forEach(script => {
    const { importsModules = [] } = script
    const lodashImports = importsModules.filter(name => name.startsWith('lodash/'))

    if (lodashImports.length) {
      console.log(`Found ${lodashImports.length} imports in ${script.name}`)
      lodashImports.forEach(name => {
        final[name] = name.split('/')
      })
    }
  })

  await runtime.fsx.writeFileAsync(
    runtime.resolve('lodash-imports.json'),
    JSON.stringify(final, null, 2)
  )
}

main()
