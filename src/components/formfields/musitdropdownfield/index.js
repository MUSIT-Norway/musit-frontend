import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import validate from '../common/validators';
import { I18n } from 'react-i18nify';

export default class MusitDropDownField extends Component {
  static propTypes = {
    value: PropTypes.string, // Should be any
    placeHolder: PropTypes.string,
    tooltip: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.string,
    minimumLength: PropTypes.number,
    maximumLength: PropTypes.number,
    validator: PropTypes.func,
    precision: PropTypes.number,
    items: PropTypes.array.isRequired,
    translateKeyPrefix: PropTypes.string,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    validate: 'text',
    value: '',
    placeHolder: 'Choose ...'
  }

  getOptions() {
    return this.props.items.map((el) => ({
      value: el,
      label: this.props.translateKeyPrefix ? I18n.t(this.props.translateKeyPrefix.concat(el)) : el
    }));
  }

  classNameOnlyWithInput() {
    let lvString = '';
    if (this.props.validator ? this.props.validator(this.props) : validate(this.props) === 'error') {
      lvString = 'has-error';
    } else {
      lvString = '';
    }
    return lvString;
  }

  render() {
    return (
      <div className={this.classNameOnlyWithInput()}>
        <Select
          placeholder={this.props.placeHolder}
          style={this.props.disabled ? { backgroundColor: '#eee' } : undefined }
          disabled={this.props.disabled}
          value={this.props.value}
          options={this.getOptions()}
          onChange={(el) => this.props.onChange(el.value)}
          data-toggle="tooltip"
          title={this.props.tooltip}
          clearable={false}
        />
      </div>
    );
  }
}
