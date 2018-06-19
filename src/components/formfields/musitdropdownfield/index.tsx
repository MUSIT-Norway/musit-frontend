import * as React from 'react';
import Select from 'react-select';
import validate from '../common/validators';
import { I18n } from 'react-i18nify';
import { Component } from 'react';
import { TODO } from '../../../types/common';

interface MusitDropDownFieldProps {
  value?: string; // Should be any
  addOnPrefix?: string;
  help?: string; // always ? on add on after
  placeHolder?: string;
  tooltip?: string;
  onChange: Function; // func.isRequired,
  validate?: string; // PropTypes.string,
  minimumLength?: number;
  maximumLength?: number;
  validator?: Function;
  precision?: number;
  items: Array<any>; // PropTypes.array.isRequired,
  translateKeyPrefix?: string;
  disabled?: boolean;
}

/* Old
static propTypes = {
  value: PropTypes.string, // Should be any
  addOnPrefix: PropTypes.string,
  help: PropTypes.string, // always ? on add on after
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
};
*/

export default class MusitDropDownField extends Component<MusitDropDownFieldProps> {
  static defaultProps = {
    validate: 'text',
    value: '',
    placeHolder: 'Choose ...'
  };

  getOptions() {
    return this.props.items.map(el => ({
      value: el,
      label: this.props.translateKeyPrefix
        ? I18n.t(this.props.translateKeyPrefix.concat(el))
        : el
    }));
  }

  classNameOnlyWithInput() {
    let lvString = '';
    if (
      this.props.validator
        ? this.props.validator(this.props)
        : validate(this.props) === 'error'
    ) {
      lvString = 'has-error';
    } else {
      lvString = '';
    }
    return lvString;
  }

  classNameWithSpan() {
    let lvString = ' ';
    if (
      this.props.validator
        ? this.props.validator(this.props)
        : validate(this.props) === 'error'
    ) {
      lvString = 'input-group has-error';
    } else {
      lvString = 'input-group';
    }
    return lvString;
  }

  render() {
    const lcAddOnPrefix = this.props.addOnPrefix ? (
      <span className="input-group-addon">{this.props.addOnPrefix}</span>
    ) : null;
    const lcPlaceholder = (
      <Select
        placeholder={this.props.placeHolder}
        style={this.props.disabled ? { backgroundColor: '#eee' } : undefined}
        disabled={this.props.disabled}
        value={this.props.value}
        options={this.getOptions()}
        onChange={el => this.props.onChange((el as TODO).value)}
        data-toggle="tooltip"
        //  title={this.props.tooltip}
        clearable={false}
      />
    );

    const lcHelp = this.props.help ? <span className="input-group-addon">?</span> : null;

    return lcAddOnPrefix !== null || lcHelp !== null ? (
      <div className={this.classNameWithSpan()}>
        {lcAddOnPrefix}
        {lcPlaceholder}
        {lcHelp}
      </div>
    ) : (
      <div className={this.classNameOnlyWithInput()}>{lcPlaceholder}</div>
    );
  }
}
