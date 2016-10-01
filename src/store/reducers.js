import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from '../reducers/auth'
import fakeAuthReducer from '../reducers/fake-auth-info'
import languageReducer from '../reducers/language'
import autosuggestReducer from '../reducers/suggest'
import picklistReducer from '../reducers/picklist'
import storagePanelReducer from '../reducers/storageunit/panel'
import storagePanelStateReducer from '../reducers/storageunit/panel/state'
import storageNodeGridReducer from '../reducers/storageunit/grid'
import storageUnitModalReducer from '../reducers/storageunit/modal'
import storageUnitStatsReducer from '../reducers/storageunit/stats'
import storageObjectGridReducer from '../reducers/storageobject/grid'
import organizationReducer from '../reducers/organization'
import observationReducer from '../reducers/observation'
import controlReducer from '../reducers/control'
import observationControlGridReducer from '../reducers/grid/observationcontrol'
import nodeGridReducer from '../reducers/grid/node'
import objectGridReducer from '../reducers/grid/object'

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    auth: authReducer,
    fakeAuthInfo: fakeAuthReducer,
    language: languageReducer,
    suggest: autosuggestReducer,
    picks: picklistReducer,
    storagePanelUnit: storagePanelReducer,
    storageGridUnit: storageNodeGridReducer,
    storageUnitModal: storageUnitModalReducer,
    storageUnitStats: storageUnitStatsReducer,
    storagePanelState: storagePanelStateReducer,
    storageObjectGrid: storageObjectGridReducer,
    organization: organizationReducer,
    observation: observationReducer,
    control: controlReducer,
    observationControlGrid: observationControlGridReducer,
    nodeGrid: nodeGridReducer,
    objectGrid: objectGridReducer,
    ...asyncReducers
  })
}

// TODO Use this to lazy load reducers in Routes !!!!
export const injectReducers = (store, reducers) => {
  reducers.forEach((r) => (store.asyncReducers[r.key] = r.reducer))
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
