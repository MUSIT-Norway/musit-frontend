import React, { Component, PropTypes } from 'react';
import Template from '../../models/PrintTemplate';
import IFrame from './IFrame';
import './ChooseTemplate.css';

class ChooseTemplate extends Component {
  static propTypes = {
    templates: PropTypes.arrayOf(PropTypes.instanceOf(Template)),
    loadTemplates: PropTypes.func.isRequired
  };

  static defaultProps = {
    templates: []
  };

  componentWillMount() {
    this.props.loadTemplates();
  }

  render() {
    return (
      <div className="templateChooser">
        <ul>
          {this.props.templates.map((template, i) =>
            <li key={i}>
              {template.name}<br />
              <IFrame
                frameProps={{ width: 255, height: 100, frameBorder: 0, scrolling: 'no'}}
                content={'<h1>Hello</h1>'}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default ChooseTemplate;