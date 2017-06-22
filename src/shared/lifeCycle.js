// @flow
import React from 'react';

type Methods = {
  onMount?: (props: *) => void,
  onReceiveProps?: (props: *) => void,
  onUnmount?: (props: *) => void
};

export default ({
  onMount = () => {},
  onReceiveProps = () => {},
  onUnmount = () => {}
}: Methods) => (Component: any) => {
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
