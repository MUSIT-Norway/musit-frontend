import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MUSTFIX } from '../types/common';

interface IFrameProps {
  frameProps: object; //PropTypes.object,
  content: string; // PropTypes.string,
  writeToDocument: Function; // PropTypes.func.isRequired
}

/* OLD:
static propTypes = {
  frameProps: PropTypes.object,
  content: PropTypes.string,
  writeToDocument: PropTypes.func.isRequired
};
*/

class IFrame extends React.Component<IFrameProps> {
  domNode: MUSTFIX;

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
    return <iframe title="anonymous" {...this.props.frameProps} />;
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
