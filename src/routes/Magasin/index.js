import ObservationRoute from './Observation'
import ControlRoute from './Control'
import ControlObservationRoute from './ControlObservation'
// import StorageUnitRoute from './StorageUnit'

export default (store) => ({
  path: 'magasin/:id',
  childRoutes: [
    ControlRoute(store),
    ObservationRoute(store),
    ControlObservationRoute(store)
    // StorageUnitRoute(store)
  ]
})
