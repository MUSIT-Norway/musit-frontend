import React from 'react';
import ReactDOM from 'react-dom';

class IFrame extends React.Component {

  static propTypes = {
    frameProps: React.PropTypes.object,
    content: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    frameProps: {
      frameBorder: 0
    }
  };

  updateIFrameContents() {
    const contentWindow = this.domNode.contentWindow;
    contentWindow.document.open();
    contentWindow.document.write(this.props.content);
    contentWindow.document.close();
    //setTimeout(() => contentWindow.print(), 10000);
  }

  render() {
    return (
      <iframe {...this.props.frameProps} />
    );
  }

  componentDidMount() {
    this.domNode = ReactDOM.findDOMNode(this);
    this.updateIFrameContents();
  }

  componentDidUpdate() {
    this.updateIFrameContents();
  }
}

export default IFrame;