// @flow
import React from 'react';

export type Methods = {
  onMount?: (props: *) => void,
  onReceiveProps?: (props: *) => void,
  onUnmount?: (props: *) => void
};

const noop = props => {};

export default (methods: Methods) => (Component: any) => {
  if (typeof methods === 'function') {
    throw new Error(
      'Illegal lifecycle argument, expected an object but found a function.'
    );
  }
  const onMount = methods.onMount || noop;
  const onUnmount = methods.onUnmount || noop;
  const onReceiveProps = methods.onReceiveProps || noop;

  class MountWrapper extends React.Component {
    props: *;

    componentWillMount() {
      onMount(this.props);
    }

    componentWillUnmount() {
      onUnmount(this.props);
    }

    componentWillReceiveProps(props: *) {
      onReceiveProps(props);
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return MountWrapper;
};
