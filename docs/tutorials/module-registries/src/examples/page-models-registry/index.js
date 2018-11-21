import { pageModels } from './page-models'
import * as HomePage from './pages/HomePage'
import * as AboutPage from './pages/AboutPage'

pageModels.register('HomePage', () => HomePage)
pageModels.register('AboutPage', () => AboutPage)

console.log('Available Pages')
console.log(pageModels.available)

const aboutPage = pageModels.lookup('AboutPage')

console.log(`About Page Path: ${aboutPage.route}`)
