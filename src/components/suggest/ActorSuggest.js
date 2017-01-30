import React from 'react';
import Autosuggest from 'react-autosuggest';
import Config from '../../config';
import Actor from '../../models/actor';
import suggest$Fn, { update$, clear$} from './suggestStore';
import inject from '../../rxjs/RxInject';

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
    appSession: React.PropTypes.object.isRequired
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
      const museumId = this.props.appSession.getMuseumId();
      const token = this.props.appSession.getAccessToken();
      this.props.update({update, museumId, token});
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

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  suggest$: suggest$Fn('actorSuggest', Config.magasin.urls.actor.searchUrl)
};

const commands = { update$, clear$ };

export default inject(data, commands)(ActorSuggest);
