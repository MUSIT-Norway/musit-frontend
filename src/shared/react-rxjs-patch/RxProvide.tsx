import * as React from 'react';
import { TODO } from '../../types/common';
//import entries from 'object.entries';
let entries = require('object.entries');

const mapObject = (object: TODO, mapFn: TODO) => {
  return entries(object).reduce((acc: TODO, [k, v]: [TODO, TODO]) => {
    acc[k] = mapFn(v);
    return acc;
  }, {});
};

export const provide = (providing: TODO) => (Component: TODO) => {
  const types = mapObject(providing, (v: TODO) => v.type);
  const objects = mapObject(providing, (v: TODO) => v.value);
  class Provided extends React.Component {
    static childContextTypes = types;

    getChildContext() {
      return objects;
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return Provided;
};
