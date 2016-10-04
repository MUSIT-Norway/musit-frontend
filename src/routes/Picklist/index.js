import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'picklist/:type',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Component = require('../../containers/picklist').default
      const picksReducer = require('../../reducer/picklist').default
      injectReducer(store, { key: 'picks', reducer: picksReducer })
      const authReducer = require('../../reducer/auth').default
      injectReducer(store, { key: 'auth', reducer: authReducer })
      const storageUnitModal = require('../../reducer/storageunit/modal').default
      injectReducer(store, { key: 'storageUnitModal', reducer: storageUnitModal })
      cb(null, Component)
    }, 'picklist')
  }
})
