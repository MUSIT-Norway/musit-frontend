import React from 'react';

import { Observable } from 'rxjs';

import combineLatestObj from './combineLatestObj';

import RxContainer from './RxContainer';

export default (settings) => (Component) => {
  const observables = settings.state || {},
    observers = settings.actions || {},
    props = settings.props || {},
    provided = settings.provided || {};

  const callbacks = Object.entries(observers).reduce((acc, [key, observer]) => {
    acc[key.replace(/\$$/, '')] = (value) => observer.next(value);
    return acc;
  }, {});

  const propsObservable = Object.keys(observables).length === 0
        ? Observable.of([{}])
        : combineLatestObj(observables).share();

  const types = Object.entries(provided).reduce((acc, [k, v]) => {
    acc[k] = v.type;
    return acc;
  }, {});

  class Injected extends React.Component {
    static contextTypes = types;
    render() {
      return (
                <RxContainer
                    props={{...this.context, ...this.props, ...props}}
                    callbacks={callbacks}
                    component={Component}
                    observable={propsObservable}
                />
            );
    }
    }

  return (initialProps) => <Injected {...initialProps} />;
};