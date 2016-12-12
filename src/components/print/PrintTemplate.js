import React, { Component, PropTypes } from 'react';
import IFrame from '../../util/IFrame';
import Template from '../../models/PrintTemplate';
import './style.css';

class PrintTemplate extends Component {
  static propTypes = {
    renderTemplate: PropTypes.func.isRequired,
    selected: PropTypes.instanceOf(Template),
    marked: PropTypes.array,
    nextStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.renderTemplate(this.props.selected.id, 1, this.props.marked.map(ntp => ({
      uuid: ntp.nodeId,
      name: ntp.name
    })));
  }

  render() {
    return (
      <div className="templatePrint">
        <IFrame
          frameProps={{
            width: '100%',
            height: '100%',
            frameBorder: 0,
            scrolling: 'no'
          }}
          content={this.props.rendered}
          onLoad={(domNode) => {
            if (this.props.rendered) {
              domNode.contentWindow.print();
            }
          }}
        />
      </div>
    );
  }
}

export default PrintTemplate;