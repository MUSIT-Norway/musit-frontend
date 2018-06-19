import * as React from 'react';
import { TODO } from '../../types/common';

type ScrollToTopProps = {
  location?: TODO;
};

export default class ScrollToTop extends React.Component<ScrollToTopProps> {
  componentDidUpdate(prevProps: ScrollToTopProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;

    /*If React 15, this may be needed as it doesn't support multiple elements returning in render():
    return React.Children.only(this.props.children);  // (this will throw if there are many children)
*/
  }
}

export function scrollToTop(MyComponent: React.ComponentType) {
  return (props: any) => (
    <ScrollToTop>
      <MyComponent {...props} />
    </ScrollToTop>
  );
}
