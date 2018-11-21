import { PageModel } from './page-models'

const provider = {
  pageSelectors: {
    main: '#home-page',
  },
}

const p = new PageModel({ provider })

const runtime = new Runtime()
