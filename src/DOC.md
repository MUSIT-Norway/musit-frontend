# Documentation of terms and functionality used

## provide
provides services objects to all underlying components with the use of react context
- Example: { appSession: { type: React.PropTypes.object, value: () => appSession } }

## inject
injects provided service objects, observables and observers as props to connected component
- provided service objects
    - Retrieved from context, app will crash if one of these is not provided
        - Example: { provided: { appSession: { type: React.PropTypes.object.isRequired } } }
- observables:
    - An object with values of type Rx.Observables
        - Example: { store$ } or { someService: { type: React.PropTypes.object.isRequired, observable: (someService) => someService.store$ } }
- observers
    - An object with values of type Rx.Subject
        - Example: { callMe$ }
