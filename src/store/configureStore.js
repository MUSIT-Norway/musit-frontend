import { applyMiddleware, compose, createStore } from 'redux'
import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import createMiddleware from '../middleware/clientMiddleware'
import ApiClient from '../helpers/ApiClient'
const client = new ApiClient();
import { updateLocation } from './location'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [createMiddleware(client)]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEVELOPMENT__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
      makeRootReducer(),
      initialState,
      compose(
          applyMiddleware(...middleware),
          ...enhancers
      )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
