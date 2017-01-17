import React from 'react';

const mapObject = (object, mapFn) => {
  return Object.entries(object).reduce((acc, [k, v]) => {
    acc[k] = mapFn(v);
    return acc;
  }, {});
};

export default (providing) => (Component) => {
  const types = mapObject(providing, (v) => v.type);
  const objects = mapObject(providing, (v) => v.value.call(this));
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