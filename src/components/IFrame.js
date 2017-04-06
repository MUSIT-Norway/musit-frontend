import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

class IFrame extends React.Component {
  static propTypes = {
    frameProps: PropTypes.object,
    content: PropTypes.string,
    writeToDocument: PropTypes.func.isRequired
  };

  static defaultProps = {
    frameProps: {
      frameBorder: 0
    }
  };

  updateIFrameContents() {
    const contentWindow = this.domNode.contentWindow;
    this.props.writeToDocument(contentWindow, this.props.content);
  }

  render() {
    return <iframe {...this.props.frameProps} />;
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
