import * as React from 'react';
//import * as PropTypes from 'prop-types';
import { TODO } from '../../types/common';

const getDevToolsExt = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window['__REDUX_DEVTOOLS_EXTENSION__'] || window['devToolsExtension'];
  } else return undefined;
};

interface RxContainerProps<T> {
  component: React.ComponentType<T>;
  observable: any;
  injectedProps: Function | object;
  initialState: TODO;
}

export default class RxContainer<T> extends React.Component<RxContainerProps<T>> {
  devTools: TODO;
  unsubscribe: TODO;
  subscription: TODO;
  componentWillMount() {
    const devToolsExt = getDevToolsExt();
    if (devToolsExt) {
      this.devTools = devToolsExt.connect();
      this.unsubscribe = this.devTools.subscribe((message: TODO) => {
        if (
          message.type === 'DISPATCH' &&
          (message.payload.type === 'JUMP_TO_ACTION' ||
            message.payload.type === 'JUMP_TO_STATE')
        ) {
          const props = JSON.parse(message.state);
          this.setState({ props });
        }
      });
    }
  }

  componentDidMount() {
    this.subscription = this.props.observable.subscribe((props: TODO) => {
      console.log('DEVTOOLS');
      if (this.devTools) {
        console.log('DEVTOOLS', props, this.devTools);
        this.devTools.send('update', props);
        console.log('DEVTOOLS', props, this.devTools);
      }
      this.setState({ props });
    });
  }

  componentWillReceiveProps(nextProps: RxContainerProps<T>) {
    if (nextProps.observable !== this.props.observable) {
      this.subscription.unsubscribe();
      this.setState({ props: nextProps.initialState });
      this.subscription = nextProps.observable.subscribe((props: TODO) => {
        if (this.devTools) {
          this.devTools.send('update', props);
        }
        this.setState({ props });
      });
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    const devToolsExt = getDevToolsExt();
    if (devToolsExt) {
      this.unsubscribe();
      devToolsExt.disconnect();
    }
  }

  render() {
    if (!this.state) {
      return null;
    }
    const upstreamProps = { ...this.props, ...(this.state as TODO).props };
    const customProps =
      typeof this.props.injectedProps === 'function'
        ? this.props.injectedProps(upstreamProps)
        : {
            ...upstreamProps,
            ...this.props.injectedProps
          };
    const Component = this.props.component;
    return <Component {...customProps} />;
  }
}
