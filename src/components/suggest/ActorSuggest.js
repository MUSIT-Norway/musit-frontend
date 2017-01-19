import React from 'react';
import Autosuggest from 'react-autosuggest';
import Config from '../../config';
import Actor from '../../shared/models/actor';
import suggest$Fn, { update$, clear$} from './suggestStore';
import inject from '../../state/inject';

export class ActorSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    update: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    clear: React.PropTypes.func,
    museumId: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(next) {
    if (next.value !== this.props.value) {
      this.setState({...this.state, value: next.value});
    }
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event, { newValue }) => this.setState({ ...this.state, value: newValue })
  }

  requestSuggestionUpdate(update) {
    if (update.value.length > 2) {
      const museumId = this.props.museumId;
      this.props.update({update, museumId});
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest.data || []}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={this.requestSuggestionUpdate}
        getSuggestionValue={(suggestion) => suggestion.fn}
        renderSuggestion={(suggestion) => <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>}
        inputProps={{ ...this.doneByProps, value: this.state.value }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={(event, { suggestion }) => {
          if (event.keyCode === 13) {
            event.preventDefault();
          }
          this.props.onChange(new Actor(suggestion));
        }}
      />
    );
  }
}

export default inject({
  provided: { appSession: { type: React.PropTypes.object.isRequired } },
  state: { suggest$: suggest$Fn(Config.magasin.urls.actor.searchUrl) },
  actions: { update$, clear$ }
})(ActorSuggest);
