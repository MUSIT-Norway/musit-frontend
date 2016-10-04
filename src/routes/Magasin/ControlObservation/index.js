import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'observationcontrol',
  showControls: true,
  showObservations: true,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Component = require('../../../containers/observationcontrol/grid').default
      const storageGridUnit = require('../../../reducer/storageunit/grid').default
      injectReducer(store, { key: 'storageGridUnit', reducer: storageGridUnit })
      const observationcontrol = require('../../../reducer/grid/observationcontrol').default
      injectReducer(store, { key: 'observationControlGrid', reducer: observationcontrol })
      cb(null, Component)
    }, 'listEvents')
  }
})
