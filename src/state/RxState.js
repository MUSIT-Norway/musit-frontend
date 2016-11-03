import React, { PropTypes, Component } from "react";
import { Observable, Subject } from 'rxjs/Rx';
import * as logger from 'loglevel';

// Creates a state for use with the connect and provider below
export function createState(reducer$, initialState$ = Observable.of({})) {
  const end$ = new Subject();
  const state$ = initialState$
    .merge(reducer$)
    .scan((state, [scope, reducer]) =>
      ({ ...state, [scope]: reducer(state[scope]) }))
    .publishReplay(1)
    .refCount()
    .takeUntil(end$)
  return {
    end$,
    state$
  };
}

// Used much the same way as redux connect
export const connect = (selector = state => state) => (providedState$) => {
  return function wrapWithConnect(WrappedComponent) {
    return class Connect extends Component {
      state$ = providedState$.state$;
      end$ = providedState$.end$;

      static contextTypes = {
        state$: PropTypes.object // .isRequired
      };

      constructor(props, context) {
        super(props, context);
        // Note: we could possibly change this to:
        // this.state$ = this.state$ || this.context.state$;
        // so that a connected component can have its own state.
        this.state$ = this.context.state$ || this.state$;
      }

      componentWillMount() {
        this.subscription = this.state$.map(selector).subscribe(
          state => this.setState(state),
          e => logger.debug('onError: %s', e),
          () => logger.debug('onCompleted')
        );
      }

      componentWillUnmount() {
        this.end$.next('destroy');
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

// We can use this in the future maybe, thus making global state aka the way redux does it
export class RxStateProvider extends Component {
  static propTypes = {
    state$: PropTypes.object.isRequired
  };

  static childContextTypes = {
    state$: PropTypes.object.isRequired
  };

  getChildContext() {
    return { state$: this.props.state$ };
  }

  render() {
    return this.props.children;
  }
}
