import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'observation',
  childRoutes: [
    {
      path: 'add',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          const Component = require('../../../containers/observation/add').default
          const storageGridUnit = require('../../../reducer/storageunit/grid').default
          injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
          const authReducer = require('../../../reducer/auth').default
          injectReducer(store, { key: 'auth', reducer: authReducer })
          const suggestReducer = require('../../../reducer/suggest').default
          injectReducer(store, { key: 'suggest', reducer: suggestReducer })
          cb(null, Component)
        }, 'addObservation')
      }
    },
    {
      path: 'edit',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          const Component = require('../../../containers/observation/edit').default
          const storageGridUnit = require('../../../reducer/storageunit/grid').default
          injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
          cb(null, Component)
        }, 'editObservation')
      }
    },
    {
      path: ':obsId',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          const Component = require('../../../containers/observation/view').default
          const storageGridUnit = require('../../../reducer/storageunit/grid').default
          injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
          const observationReducer = require('../../../reducer/observation').default
          injectReducer(store, { key: 'observation', reducer: observationReducer })
          cb(null, Component)
        }, 'viewObservation')
      }
    }
  ]
})
