import React from 'react';
import Autosuggest from 'react-autosuggest';
import inject from '../../state/inject';
import suggest$Fn, { update$, clear$} from './suggestStore';
import Config from '../../config';

export class AddressSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.object,
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
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
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

  requestSuggestionUpdate(update) {
    if (update.value.length > 2) {
      const token = this.props.appSession.getAccessToken();
      this.props.update({update, token});
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest.data || []}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={this.requestSuggestionUpdate}
        getSuggestionValue={this.getAddressSuggestionValue}
        renderSuggestion={this.renderAddressSuggestion}
        inputProps={{ ...this.doneByProps, value: this.state.value }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  suggest$: suggest$Fn(Config.magasin.urls.geolocation.searchUrl)
};

const commands = { update$, clear$ };

export default inject(data, commands)(AddressSuggest);
