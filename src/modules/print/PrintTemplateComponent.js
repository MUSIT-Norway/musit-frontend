import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IFrame from '../../components/IFrame';
import './PrintTemplateComponent.css';
import Config from '../../config';
import { I18n } from 'react-i18nify';
import reduce from 'lodash/reduce';

export class PrintTemplateComponent extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    loadTemplates: PropTypes.func.isRequired,
    renderTemplate: PropTypes.func.isRequired,
    setTemplateId: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    clearRendered: PropTypes.func.isRequired,
    writeToDocument: PropTypes.func.isRequired,
    setLevel: PropTypes.func.isRequired,
    marked: PropTypes.array,
    rendered: PropTypes.string
  };

  static DEFAULT_CODE = 1;

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.selectLevel = this.selectLevel.bind(this);
  }

  componentWillMount() {
    this.props.clearAll();
    this.props.loadTemplates({
      token: this.props.appSession.accessToken
    });
  }

  canSelectPath(templateId) {
    return Config.print.labelConfig.canSelectPath[templateId];
  }

  selectTemplate(e, templateId = e.target.value * 1, level = this.props.store.level) {
    this.props.setTemplateId(templateId);
    this.props.clearRendered();
    if (templateId) {
      const codeFormat =
        Config.print.labelConfig.codeFormat[templateId] ||
        PrintTemplateComponent.DEFAULT_CODE;
      const nodes = this.props.marked.map(markedNode => ({
        uuid: markedNode.value.nodeId,
        name: this.canSelectPath(templateId)
          ? PrintTemplateComponent.getDisplayName(markedNode, level)
          : markedNode.value.name
      }));
      this.props.renderTemplate({
        templateId,
        codeFormat,
        nodes,
        token: this.props.appSession.accessToken
      });
    }
  }

  static getDisplayName(node, skipCount) {
    const subPath = node.path.slice(skipCount);
    const pathStr = reduce(
      subPath,
      (acc, p) => (acc !== '' ? acc + ' / ' : '') + p.name,
      ''
    );
    return (pathStr ? pathStr + ' / ' : '') + node.value.name;
  }

  selectLevel(e, level = e.target.value * 1) {
    this.props.setLevel(level);
    this.selectTemplate(null, this.props.store.templateId, level);
  }

  render() {
    return (
      <div className="templatePrint">
        <select className="printTool template" onChange={this.selectTemplate}>
          <option>{I18n.t('musit.template.chooseTemplate')}</option>
          {[]
            .concat(this.props.store.templates)
            .filter(t => t)
            .map((template, i) => (
              <option key={i} value={template.id}>{template.name}</option>
            ))}
        </select>
        {' '}
        {this.canSelectPath(this.props.store.templateId) &&
          <select
            className="printTool level"
            onChange={this.selectLevel}
            defaultValue={this.props.store.level}
          >
            <option value={-2}>{I18n.t('musit.template.pathWithTwoClosest')}</option>
            <option value={2}>{I18n.t('musit.template.pathFromBuilding')}</option>
            <option value={0}>{I18n.t('musit.template.fullPath')}</option>
          </select>}
        {' '}
        {this.props.store.rendered &&
          <input
            className="printTool"
            onClick={() => {
              const iFrame = this.previewFrame.domNode.contentWindow;
              const result = iFrame.document.execCommand('print', false, null);
              if (!result) {
                iFrame.print();
              }
            }}
            type="button"
            value={I18n.t('musit.template.printTemplate')}
          />}
        {this.props.store.rendered &&
          <IFrame
            ref={child => (this.previewFrame = child)}
            frameProps={{
              width: '100%',
              height: '95%',
              frameBorder: 0,
              scrolling: 'yes'
            }}
            content={this.props.store.rendered}
            writeToDocument={this.props.writeToDocument}
          />}
      </div>
    );
  }
}
