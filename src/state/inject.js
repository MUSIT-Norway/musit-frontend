import React from 'react';

import {Observable} from 'rxjs';

import RxContainer from './RxContainer';

function combineLatestObj(obj) {
  const sources = [];
  const keys = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return Observable.combineLatest(sources, (...args) => {
    const combination = {};
    for (let i = args.length - 1; i >= 0; i -= 1) {
      combination[keys[i]] = args[i];
    }
    return combination;
  });
}

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