# Documentation of terms and functionality used

## provide
provides services objects to all underlying components with the use of react context
- Example: { appSession: { type: React.PropTypes.object, value: () => appSession } }

## inject
injects provided service objects, state and actions as props to connected component
- provided service objects
    - Retrieved from context, app will crash if one of these is not provided
        - Example: { provided: { appSession: { type: React.PropTypes.object.isRequired } } }
- state
    - An object with values of type Rx.Observables
        - Example: { store$ }
- actions
    - An object with values of type Rx.Subject
        - Example: { callMe$ }