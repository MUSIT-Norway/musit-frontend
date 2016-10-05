// We only need to import the modules necessary for initial render
import AppLayout from '../layouts/AppLayout'
import Home from './Home'
import PicklistRoute from './Picklist'
import MagasinRoute from './Magasin'

export const createRoutes = (store) => ({
  path        : '/',
  component   : AppLayout,
  indexRoute  : Home,
  childRoutes : [
    PicklistRoute(store),
    MagasinRoute(store)
  ]
})

export default createRoutes
