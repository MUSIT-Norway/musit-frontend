# RXJS
#### Documentation of terms and functionality used

The following terms describe the two higher order functions provide and inject, currently residing in src/state/. 

## provide
provides services objects to all underlying components with the use of react context
- Example: { appSession: { type: React.PropTypes.object, value: () => appSession } }

Usage:

```
export default provide({
  appSession: {
    type: PropTypes.object,
    value: () => new AppSession()
  }
})(appRouter);
```

## inject
injects data and commands as props to connected component
- data:
    - An object with values of type Rx.Observables or plain objects, either by value or from context
        - Example 1: { store$ }
        - Example 2: { someService: { type: React.PropTypes.object.isRequired }
        - Example 3: { someService: { type: React.PropTypes.object.isRequired, observable: (someService) => someService.store$ } }
- commands
    - An object with values of type Rx.Subject, e.g. the commands
        - Example: { callMe$ }

Usage:

for sub components or pages:
```
const data = {
    appSession: {
      type: React.PropTypes.object.isRequired
    },
    store$
};
const commands = {
    callMe$,
    loadStuff$
};
export default inject(data, commands)(SomeComp);
```

for certain use cases, we can bind the comp state to an observable in the provided context variable.

```
const data = {
  appSession: {
    type: PropTypes.object.isRequired,
    observable: (object) => object.store$
  }
};
export default inject(data)(SomeComp);
```

we can also name the bound comp state:

```
const data = {
  appSession: {
    type: PropTypes.object.isRequired,
    observable: (object) => ({ appState: object.store$ })
  }
};
export default inject(data)(SomeComp);
```

In the latter example both the appSession variable from context AND the appState variable derived from the observable function will be mapped to the component props.