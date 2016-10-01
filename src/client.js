import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/configureStore'
import AppContainer from './containers/AppContainer'

// ========================================================
// Store Instantiation
// ========================================================
// const initialState = window.___INITIAL_STATE__
const store = createStore() // createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('content')

let render = () => {
  const routes = require('./routes').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
      MOUNT_NODE
    )
}

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEVELOPMENT__) {
  if (window.devToolsExtension && __DEVTOOLS__) {
    window.devToolsExtension.open()
  }
}

// This code is excluded from production bundle
if (__DEVELOPMENT__) {
  if (module.hot) {
        // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

        // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

        // Setup hot module replacement
    module.hot.accept('./routes', () =>
            setImmediate(() => {
              ReactDOM.unmountComponentAtNode(MOUNT_NODE)
              render()
            })
        )
  }
}

// ========================================================
// Go!
// ========================================================
render()
