import React, { Component, PropTypes } from 'react';
import IFrame from '../../util/IFrame';
import Template from './PrintTemplate';
import './PrintComponent.css';

class ChooseTemplate extends Component {
  static propTypes = {
    templates: PropTypes.arrayOf(PropTypes.instanceOf(Template)),
    loadTemplates: PropTypes.func.isRequired,
    selectTemplate: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    clearDialog: PropTypes.func.isRequired,
    clearRendered: PropTypes.func.isRequired,
    marked: PropTypes.array,
    rendered: PropTypes.string
  };

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.selectType = this.selectType.bind(this);
  }

  componentWillMount() {
    this.props.clearDialog();
    this.props.loadTemplates();
  }

  selectType(e) {
    const typeId = e.target.value * 1;
    if (typeId) {
      this.props.selectType(typeId);
      this.selectTemplate(null, this.props.selectedTemplate * 1, typeId);
    }
  }

  selectTemplate(
    e,
    templateId = e.target.value * 1,
    selectedType = this.props.selectedType
  ) {
    this.props.clearRendered();
    if (templateId) {
      this.props.selectTemplate(templateId);
      this.props.renderTemplate(templateId, selectedType, this.props.marked.map(ntp => ({
        uuid: ntp.nodeId,
        name: ntp.name
      })));
    }
  }

  render() {
    return (
      <div className="templatePrint">
        <select
          className="printTool"
          onChange={this.selectTemplate}
        >
          <option>Select template</option>
          {[].concat(this.props.templates).filter(t => t).map((template, i) =>
            <option key={i} value={template.id}>{template.name}</option>
          )}
        </select>
        {' '}
        {this.props.rendered &&
          <select
            className="printTool"
            onChange={this.selectType}
            value={this.props.selectedType}
          >
            <option>Select type</option>
            <option value={1}>QR Code</option>
            <option value={2}>Data Matrix</option>
          </select>
        }
        {' '}
        {this.props.rendered &&
          <input
            className="printTool"
            onClick={() => this.previewFrame.domNode.contentWindow.print()}
            type="button"
            value="Print template"
          />
        }
        {this.props.rendered &&
          <IFrame
            ref={(child) => this.previewFrame = child}
            frameProps={{
              width: '100%',
              height: '95%',
              frameBorder: 0,
              scrolling: 'yes'
            }}
            content={this.props.rendered}
          />
        }
      </div>
    );
  }
}

export default ChooseTemplate;