import * as React from 'react';

import { Observable } from 'rxjs';

import RxContainer from './RxContainer';

import { TODO } from '../../types/common';
//import entries from "object.entries";
const entries = require('object.entries');

function combineLatestObj(obj: TODO) {
  const sources = [] as TODO[];
  const keys = [] as TODO[];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return Observable.combineLatest(sources, (...args: TODO[]) => {
    const combination = {};
    for (let i = args.length - 1; i >= 0; i -= 1) {
      combination[keys[i]] = args[i];
    }
    return combination;
  });
}

export default <Props extends {}>(data = {}, commands = {}, props = {}) => (
  Component: TODO
) => {
  const callbacks = entries(
    commands
  ).reduce((acc: TODO, [key, observer]: [TODO, TODO]) => {
    acc[key.replace(/\$$/, '')] = (value: TODO) => observer.next(value);
    return acc;
  }, {});

  const contextTypes = entries({
    ...data
  }).reduce((acc: TODO, [k, v]: [TODO, TODO]) => {
    if (v.type) {
      acc[k] = v.type;
    }
    return acc;
  }, {});

  class RxInject<Props> extends React.Component<Props> {
    static contextTypes = contextTypes;

    constructor(p: TODO, c: TODO) {
      super(p, c);

      const observablesFromValue = entries(
        data
      ).reduce((acc: TODO, [k, v]: [TODO, TODO]) => {
        if (v.subscribe) {
          acc[k] = v;
        }
        return acc;
      }, {});

      const observablesFromContext = entries(
        data
      ).reduce((acc: TODO, [k, v]: [TODO, TODO]) => {
        const contextVal = this.context[k];
        if (v.type && contextVal) {
          if (v.mapToProps) {
            return {
              ...acc,
              [k]: contextVal,
              ...v.mapToProps(contextVal)
            };
          }
          return {
            ...acc,
            [k]: contextVal
          };
        }
        return acc;
      }, {});

      const allObservables = {
        ...observablesFromValue,
        ...observablesFromContext
      };

      (this as TODO).propsObservable =
        Object.keys(allObservables).length === 0
          ? Observable.of([{}])
          : combineLatestObj(allObservables).share();
    }

    render() {
      return (
        <RxContainer
          {...this.props}
          {...callbacks}
          injectedProps={props}
          component={Component}
          observable={(this as TODO).propsObservable}
        />
      );
    }
  }

  return (initialProps: TODO) => <RxInject {...initialProps} />;
};
