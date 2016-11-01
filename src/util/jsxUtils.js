import React from 'react'

export function wrapWithContext(childContextTypes, childContext, child){

  class WrapperWithContext extends React.Component {
    static childContextTypes = { ...childContextTypes, closeModal: React.PropTypes.func };
    getChildContext() { return { ...childContext, closeModal: () => true }; }
    render() {
      return this.props.children
    }
  }

  return (
    <WrapperWithContext>
      {child}
    </WrapperWithContext>
  );
}