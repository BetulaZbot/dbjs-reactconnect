import {
  commit,
  query,
  getStore
} from './help'

import getConnect from './connect'

export default getConnect({ commit, getStore, query })

