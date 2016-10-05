import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from '../reducer/auth'
import langReducer from '../reducer/language'
import pickListReducer from '../reducer/picklist'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    auth: authReducer,
    language: langReducer,
    picks: pickListReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
