import React from 'react';

const mapObject = (object, mapFn) => {
  return Object.entries(object).reduce((acc, [k, v]) => {
    acc[k] = mapFn(v);
    return acc;
  }, {});
};

export const inject = (injectables) => (Component) => {
  const types = mapObject(injectables, (v) => v.type);
  class Injected extends React.Component {
    static contextTypes = types;
    render() {
      return <Component {...this.props} {...this.context} />;
    }
    }
  return Injected;
};

export const provide = (providing) => (Component) => {
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