import React from 'react';
import Autosuggest from 'react-autosuggest';
import autoComplete from '../../../state/autocomplete';
import Config from '../../../config';

class AddressSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    update: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    clear: React.PropTypes.func
  }

  static defaultProps = {
    id: 'addressField',
    disabled: false,
    value: ''
  }

  constructor(props) {
    super(props);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ ...this.state, value: nextProps.value });
    }
  }

  onChange(event, { newValue }) {
    this.setState({ ...this.state, value: newValue });
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
  }

  renderAddressSuggestion(suggestion) {
    const suggestionText = `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
    return (
      <span className={'suggestion-content'}>{suggestionText}</span>
    );
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={this.props.update}
        getSuggestionValue={this.getAddressSuggestionValue}
        renderSuggestion={this.renderAddressSuggestion}
        inputProps={{ ...this.doneByProps, value: this.state.value }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

export default autoComplete(Config.magasin.urls.geolocation.searchUrl)(AddressSuggest);