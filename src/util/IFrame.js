import React from 'react';
import ReactDOM from 'react-dom';

class IFrame extends React.Component {

  static propTypes = {
    frameProps: React.PropTypes.object,
    content: React.PropTypes.string.isRequired,
    onLoad: React.PropTypes.func
  };

  static defaultProps = {
    frameProps: {
      frameBorder: 0
    }
  };

  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
  }

  updateIFrameContents() {
    const contentWindow = this.domNode.contentWindow;
    contentWindow.document.open();
    contentWindow.document.write(this.props.content);
    contentWindow.document.close();
  }

  onLoad() {
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(this.domNode);
    }
  }

  render() {
    return (
      <iframe {...this.props.frameProps} onLoad={this.onLoad} />
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