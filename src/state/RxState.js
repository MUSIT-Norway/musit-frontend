import React, { PropTypes, Component } from "react";
import { Observable, Subject } from 'rxjs/Rx';

export function createAction() {
  return new Subject();
}

export function createActions(actionNames) {
  return actionNames.reduce((akk, name) => ({ ...akk, [name]: createAction() }), {});
}

export function createState(reducer$, initialState$ = Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, [scope, reducer]) =>
      ({ ...state, [scope]: reducer(state[scope]) }))
    .publishReplay(1)
    .refCount();
}

export const connect = (selector = state => state) => (providedState$) => {
  return function wrapWithConnect(WrappedComponent) {
    return class Connect extends Component {
      state$ = providedState$;

      static contextTypes = {
        state$: PropTypes.object, // .isRequired
      };

      constructor(props, context) {
        super(props, context);
        this.state$ = this.context.state$ || this.state$;
      }

      componentWillMount() {
        this.subscription = this.state$.map(selector).subscribe(state => this.setState(state));
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        return (
          <WrappedComponent {...this.state} {...this.props} />
        );
      }
    };
  };
};

export class RxStateProvider extends Component {
  static propTypes = {
    state$: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    state$: PropTypes.object.isRequired,
  };

  getChildContext() {
    return { state$: this.props.state$ };
  }

  render() {
    return this.props.children;
  }
}
