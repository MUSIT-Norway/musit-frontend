import React, { Component, PropTypes } from 'react';
import Template from '../../models/PrintTemplate';
import './ChooseTemplate.css';

class PrintTemplate extends Component {
  static propTypes = {
    renderTemplate: PropTypes.func.isRequired,
    selected: PropTypes.instanceOf(Template),
    nextStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="templateChooser">
        hei
      </div>
    );
  }
}

export default PrintTemplate;