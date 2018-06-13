// @flow
import * as React from 'react';
import { Star } from '../types/common';

export type Methods<P> = {
  onMount?: (props: P) => void;
  onReceiveProps?: (props: P) => void;
  onUnmount?: (props: P) => void;
};

const noop = (props: any) => {};

export type Hoc<P> = (comp: React.ComponentType<P>) => React.ComponentType<P>;

export default function lifeCycle<P>(methods: Methods<P>): Hoc<P> {
  return (MyComponent: React.ComponentType<P>) => {
    if (typeof methods === 'function') {
      throw new Error(
        'Illegal lifecycle argument, expected an object but found a function.'
      );
    }
    const onMount = methods.onMount || noop;
    const onUnmount = methods.onUnmount || noop;
    const onReceiveProps = methods.onReceiveProps || noop;

    class MountWrapper extends React.Component<P, void> {
      componentWillMount() {
        onMount(this.props);
      }

      componentWillUnmount() {
        onUnmount(this.props);
      }

      componentWillReceiveProps(props: P, context: Star) {
        onReceiveProps(props);
      }

      render() {
        return <MyComponent {...this.props as any} />;
      }
    }
    return MountWrapper as any;
  };
}
