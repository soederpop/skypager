import runtime from '@skypager/node'
import * as SheetHelper from '../src'

runtime.use(SheetHelper, {
  serviceAccount: runtime.resolve('secrets', 'serviceAccount.json'),
  googleProject: runtime.fsx.readJsonSync(runtime.resolve('secrets', 'serviceAccount.json'))
    .project_id,
})

describe('The Sheets Helper', function() {
  it('attaches a sheets registry to the runtime', function() {
    runtime.should.have
      .property('sheets')
      .that.is.an('object')
      .with.property('discover')
      .that.is.a('function')
  })

  it('attaches a factory function for creating a sheet helper instance', function() {
    runtime.should.have.property('sheet').that.is.a('function')
  })

  it('discovers available sheets from google drive', async function() {
    runtime.sheets.should.have.property('available').that.is.an('array').that.is.empty
    await runtime.sheets.discover()
    runtime.sheets.should.have.property('available').that.is.an('array').that.is.not.empty
  })

  it('camel cases the column names', async function() {
    const sheet = runtime.sheet('skypagersheethelperfixture')
    const { sheet1 } = await sheet.loadAll()
    sheet1.should.be.an('array').that.is.not.empty
    sheet1[0].should.be.an('object').with.property('columnOne')
  })
})
