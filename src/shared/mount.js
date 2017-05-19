// @flow
import React from 'react';

type Props = any;

const mount = (
  onMount: (props: Props) => void = () => undefined,
  onProps: (props: Props) => void = () => undefined
) =>
  (Component: any) => {
    class MountWrapper extends React.Component {
      props: Props;

      componentWillMount() {
        onMount(this.props);
      }

      componentWillReceiveProps(props: Props) {
        onProps(props);
      }

      render() {
        return <Component {...this.props} />;
      }
    }
    return MountWrapper;
  };

export default mount;
