/**
 * This provides some wrappers around the sketchtool CLI that comes with Sketch App.
 */
const { exec, spawn } = require('child-process-promise')
const { mkdirpAsync } = require('fs-extra-promise')

/**
 * Get the document metadata for a sketch file.
 *
 * Uses sketchtool metadata /path/to/file.sketch and captures the JSON
 *
 * @param {string} pathToSketchFile - which file to get metadata from
 */
async function viewSketchMetadata(pathToSketchFile, options = {}) {
  try {
    const output = await exec(`sketchtool metadata ${pathToSketchFile}`).then(({ stdout }) =>
      String(stdout)
    )
    return options.parse !== false ? JSON.parse(output) : output
  } catch (error) {
    !options.silent && console.error(`Error running: sketchtool metadata ${pathToSketchFile}`)
    throw error
  }
}

async function viewSketchDump(pathToSketchFile, options = {}) {
  let output

  try {
    const promise = spawn('sketchtool', ['dump', pathToSketchFile]).then(({ stdout }) =>
      String(stdout)
    )

    const { childProcess } = promise

    childProcess.stdout.on('data', (data) => {
      output = output + String(data)
    })

    await promise

    return options.parse !== false ? JSON.parse(output) : output

  } catch (error) {
    !options.silent && console.error(`Error running: sketchtool dump ${pathToSketchFile}`)
    throw error
  }
}

async function listSketchArtboards(pathToSketchFile, options = {}) {
  try {
    const output = await exec(`sketchtool list artboards ${pathToSketchFile}`).then(({ stdout }) =>
      String(stdout)
    )
    return options.parse !== false ? JSON.parse(output) : output
  } catch (error) {
    !options.silent && console.error(`Error running: sketchtool list artboards ${pathToSketchFile}`)
    throw error
  }
}

async function listSketchLayers(pathToSketchFile, options = {}) {
  try {
    const output = await exec(`sketchtool list layers ${pathToSketchFile}`).then(({ stdout }) =>
    )
    return options.parse !== false ? JSON.parse(output) : output
  } catch (error) {
    !options.silent && console.error(`Error running: sketchtool list layers ${pathToSketchFile}`)
    throw error
  }
}

async function listSketchPages(pathToSketchFile, options = {}) {
  try {
    const output = await exec(`sketchtool list pages ${pathToSketchFile}`).then(({ stdout }) =>
      String(stdout)
    )
    return options.parse !== false ? JSON.parse(output) : output
  } catch (error) {
    !options.silent && console.error(`Error running: sketchtool list pages ${pathToSketchFile}`)
    throw error
  }
}

module.exports = {
  viewSketchMetadata,
  viewSketchDump,
  listSketchArtboards,
  listSketchLayers,
  listSketchPages,
}
