import React, { Component, PropTypes } from 'react';
import IFrame from '../../shared/IFrame';
import './PrintTemplateComponent.css';
import Config from '../../config';
import inject from 'react-rxjs/dist/RxInject';
import store$, { loadTemplates$, renderTemplate$, clearAll$, clearRendered$ } from './printStore';

export class ChooseTemplate extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    loadTemplates: PropTypes.func.isRequired,
    renderTemplate: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    clearRendered: PropTypes.func.isRequired,
    marked: PropTypes.array,
    rendered: PropTypes.string
  };

  static DEFAULT_CODE = 1;

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.selectTemplate = this.selectTemplate.bind(this);
  }

  componentWillMount() {
    this.props.clearAll();
    this.props.loadTemplates({
      token: this.props.appSession.getAccessToken()
    });
  }

  selectTemplate(e, templateId = e.target.value * 1) {
    this.props.clearRendered();
    if (templateId) {
      const codeFormat = Config.print.labelConfig[templateId] || ChooseTemplate.DEFAULT_CODE;
      const nodes = this.props.marked.map(ntp => ({
        uuid: ntp.nodeId,
        name: ntp.name
      }));
      this.props.renderTemplate({ templateId, codeFormat, nodes, token: this.props.appSession.getAccessToken() });
    }
  }

  render() {
    console.log(this.props.store.rendered);
    return (
      <div className="templatePrint">
        <select
          className="printTool"
          onChange={this.selectTemplate}
        >
          <option>Select template</option>
          {[].concat(this.props.store.templates).filter(t => t).map((template, i) =>
            <option key={i} value={template.id}>{template.name}</option>
          )}
        </select>
        {' '}
        {this.props.store.rendered &&
          <input
            className="printTool"
            onClick={() => this.previewFrame.domNode.contentWindow.print()}
            type="button"
            value="Print template"
          />
        }
        {this.props.store.rendered &&
          <IFrame
            ref={(child) => this.previewFrame = child}
            frameProps={{
              width: '100%',
              height: '95%',
              frameBorder: 0,
              scrolling: 'yes'
            }}
            content={this.props.store.rendered}
          />
        }
      </div>
    );
  }
}

const data = {
  store$
};

const commands = {
  clearAll$,
  clearRendered$,
  loadTemplates$,
  renderTemplate$
};

export default inject(data, commands)(ChooseTemplate);