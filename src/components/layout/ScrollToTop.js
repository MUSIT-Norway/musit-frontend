import React from 'react';

export default class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export function scrollToTop(Component) {
  return props => <ScrollToTop><Component {...props} /></ScrollToTop>;
}
