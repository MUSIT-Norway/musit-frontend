import React, { Component } from "react";
import { Observable } from 'rxjs/Rx';

export function createState(reducer$, initialState$ = Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, reducer) => ({ ...state, data: reducer(state) }));
}

export const connect = (selector = state => state) => (state$) => {
  return function wrapWithConnect(WrappedComponent) {
    return class Connect extends Component {
      componentWillMount() {
        this.subscription = state$
          .map(selector)
          .subscribe(state => this.setState(state));
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