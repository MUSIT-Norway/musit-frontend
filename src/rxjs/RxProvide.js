import React from 'react';
import entries from 'object.entries';

const mapObject = (object, mapFn) => {
  return entries(object).reduce((acc, [k, v]) => {
    acc[k] = mapFn(v);
    return acc;
  }, {});
};

export default (providing) => (Component) => {
  const types = mapObject(providing, (v) => v.type);
  const objects = mapObject(providing, (v) => v.value);
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
