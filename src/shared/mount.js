// @flow
import React from 'react';

type Props = any;

const mount = (
  onMount: (props: Props) => void = () => false,
  onProps: (props: Props) => void = () => false
) =>
  (Component: any) => {
    class MountWrapper extends React.Component {
      props: Props;

      componentWillMount() {
        onMount(this.props);
      }

      componentWillReceiveProps(props) {
        onProps(props);
      }

      render() {
        return <Component {...this.props} />;
      }
    }
    return MountWrapper;
  };

export default mount;
