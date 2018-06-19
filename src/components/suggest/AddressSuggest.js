import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import Config from '../../config';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';

export class AddressSuggest extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeHolder: PropTypes.string,
    suggest: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    update: PropTypes.func,
    disabled: PropTypes.bool,
    clear: PropTypes.func
  };

  static defaultProps = {
    id: 'addressField',
    disabled: false,
    value: ''
  };

  constructor(props) {
    super(props);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: nextProps.value }));
    }
  }

  onChange(event, { newValue }) {
    this.setState(ps => ({ ...ps, value: newValue }));
    this.props.onChange(newValue);
  }

  onSuggestionSelected(event, { suggestion }) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
    const value = this.getAddressSuggestionValue(suggestion);
    this.props.onChange(value);
  }

  getAddressSuggestionValue(suggestion) {
    return `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this),
    onBlur: this.props.clear
  };

  renderAddressSuggestion(suggestion) {
    const suggestionText = `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
    return <span className={'suggestion-content'}>{suggestionText}</span>;
  }

  requestSuggestionUpdate(update) {
    if (update.value.length > 2) {
      const token = this.props.appSession.accessToken;
      this.props.update({ update, token });
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest.data || []}
        disabled={this.props.disabled}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        getSuggestionValue={this.getAddressSuggestionValue}
        renderSuggestion={this.renderAddressSuggestion}
        inputProps={{ ...this.doneByProps, value: this.state.value }}
        shouldRenderSuggestions={v => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  suggest$: suggest$Fn('addressSuggest', Config.magasin.urls.api.geolocation.searchUrl)
};

const commands = { update$, clear$ };

export default inject(data, commands)(AddressSuggest);
