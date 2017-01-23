import React from 'react';
import AutoSuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$} from './suggestStore';
import inject from '../../state/inject';

export class NodeSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    update: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    clear: React.PropTypes.func
  };

  static defaultProps = {
    id: 'nodeField',
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
      this.setState({ ...this.state, value: nextProps.value });
    }
  }

  onChange(event, { newValue }) {
    this.setState({ ...this.state, value: newValue });
  }

  onSuggestionSelected(event, { suggestion }) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
    this.props.onChange(suggestion.id);
  }

  getNodeSuggestionValue(suggestion) {
    return suggestion.name;
  }

  nodeProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this),
    onBlur: this.props.clear
  };

  renderNodeSuggestion(suggestion) {
    const suggestionText = suggestion.name;
    return (
      <span className={'suggestion-content'}>{suggestionText}</span>
    );
  }

  requestSuggestionUpdate(update) {
    if (update.value.length > 2) {
      this.props.update({update, museumId: this.props.appSession.getMuseumId(), token: this.props.appSession.getAccessToken()});
    }
  }

  render() {
    return (
      <AutoSuggest
        suggestions={this.props.suggest.data || []}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={this.requestSuggestionUpdate}
        getSuggestionValue={this.getNodeSuggestionValue}
        renderSuggestion={this.renderNodeSuggestion}
        inputProps={{ ...this.nodeProps, value: this.state.value }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

export default inject(
  { suggest$: suggest$Fn(Config.magasin.urls.storagefacility.searchUrl) },
  { update$, clear$ }
)(NodeSuggest);
