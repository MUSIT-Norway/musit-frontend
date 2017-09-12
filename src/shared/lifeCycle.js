// @flow
import React from 'react';

export type Methods<P> = {
  onMount?: (props: P) => void,
  onReceiveProps?: (props: P) => void,
  onUnmount?: (props: P) => void
};

const noop = props => {};

export type Hoc<P> = (comp: React$ComponentType<P>) => React$ComponentType<P>;

export default function lifeCycle<P>(methods: Methods<P>): Hoc<P> {
  return Component => {
    if (typeof methods === 'function') {
      throw new Error(
        'Illegal lifecycle argument, expected an object but found a function.'
      );
    }
    const onMount = methods.onMount || noop;
    const onUnmount = methods.onUnmount || noop;
    const onReceiveProps = methods.onReceiveProps || noop;

    class MountWrapper extends React.Component<P, void> {
      props: P;

      componentWillMount() {
        onMount(this.props);
      }

      componentWillUnmount() {
        onUnmount(this.props);
      }

      componentWillReceiveProps(props: P, context: any) {
        onReceiveProps(props);
      }

      render() {
        return <Component {...(this.props: any)} />;
      }
    }
    return MountWrapper;
  };
}
