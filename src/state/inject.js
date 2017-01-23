import React from 'react';

import {Observable} from 'rxjs';

import RxContainer from './RxContainer';

import entries from 'object.entries';

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

export default (provided = {}, observers = {}, props = {}) => (Component) => {
  const callbacks = entries(observers).reduce((acc, [key, observer]) => {
    acc[key.replace(/\$$/, '')] = (value) => observer.next(value);
    return acc;
  }, {});

  const contextTypes = entries({ ...provided}).reduce((acc, [k, v]) => {
    if (v.type) {
      acc[k] = v.type;
    }
    return acc;
  }, {});

  class Injected extends React.Component {
    static contextTypes = contextTypes;

    constructor(p, c) {
      super(p, c);

      const observablesFromValue = entries(provided).reduce((acc, [k, v]) => {
        if (v.subscribe) {
          acc[k] = v;
        }
        return acc;
      }, {});

      const observablesFromContext = entries(provided).reduce((acc, [k, v]) => {
        if (v.type && v.observable && this.context[k]) {
          let observable = v.observable(this.context[k]);
          observable = observable.subscribe ? { [`${k}$state`]: observable} : observable;
          return {
            ...acc,
            ...observable
          };
        }
        return acc;
      }, {});

      const allObservables = {
        ...observablesFromValue,
        ...observablesFromContext
      };

      this.propsObservable = Object.keys(allObservables).length === 0
        ? Observable.of([{}])
        : combineLatestObj(allObservables).share();
    }

    render() {
      return (
        <RxContainer
          props={{...this.context, ...this.props, ...props}}
          callbacks={callbacks}
          component={Component}
          observable={this.propsObservable}
        />
      );
    }
  }

  return (initialProps) => <Injected {...initialProps} />;
};
