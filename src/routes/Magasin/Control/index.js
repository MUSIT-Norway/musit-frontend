import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'control',
  childRoutes: [
    {
      path: 'add',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          const Component = require('../../../containers/control/add/Connect').default
          const storageGridUnit = require('../../../reducer/storageunit/grid').default
          injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
          const authReducer = require('../../../reducer/auth').default
          injectReducer(store, { key: 'auth', reducer: authReducer })
          const suggestReducer = require('../../../reducer/suggest').default
          injectReducer(store, { key: 'suggest', reducer: suggestReducer })
          cb(null, Component)
        }, 'addControl')
      }
    },
    {
      path: ':controlId',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          const Component = require('../../../containers/control/view/Connect').default
          const storageGridUnit = require('../../../reducer/storageunit/grid').default
          injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
          const observationReducer = require('../../../reducer/observation').default
          injectReducer(store, { key: 'observation', reducer: observationReducer })
          const controlReducer = require('../../../reducer/control').default
          injectReducer(store, { key: 'control', reducer: controlReducer })
          cb(null, Component)
        }, 'viewControl')
      }
    }
  ]
})
