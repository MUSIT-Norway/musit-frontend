import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Autosuggest from 'react-autosuggest';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import Config from '../../config';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';

interface AddressSuggestion {
  street: TODO;
  streetNo: TODO;
  zip: TODO;
  place: TODO;
}

interface AddressSuggestProps {
  id: string; //PropTypes.string.isRequired,
  value: string; // PropTypes.string,
  placeHolder: string; // PropTypes.string,
  suggest: TODO; // PropTypes.object,
  onChange: Function; // PropTypes.func.isRequired,
  update: Function; // PropTypes.func,
  disabled: boolean; // PropTypes.bool,
  clear: Function; // PropTypes.func,
  appSession: AppSession;
}

/* OLD 
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

*/

type AddressSuggestState = {
  value: TODO;
};
export class AddressSuggest extends React.Component<
  AddressSuggestProps,
  AddressSuggestState
> {
  static defaultProps = {
    id: 'addressField',
    disabled: false,
    value: ''
  };

  constructor(props: AddressSuggestProps) {
    super(props);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps: AddressSuggestProps) {
    if (nextProps.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: nextProps.value }));
    }
  }

  onChange(event: TODO, { newValue }: TODO) {
    this.setState(ps => ({ ...ps, value: newValue }));
    this.props.onChange(newValue);
  }

  onSuggestionSelected(event: TODO, { suggestion }: TODO) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
    const value = this.getAddressSuggestionValue(suggestion);
    this.props.onChange(value);
  }

  getAddressSuggestionValue(suggestion: AddressSuggestion) {
    return `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this),
    onBlur: this.props.clear
  };

  renderAddressSuggestion(suggestion: AddressSuggestion) {
    const suggestionText = `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
    return <span className={'suggestion-content'}>{suggestionText}</span>;
  }

  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      const token = this.props.appSession.accessToken;
      this.props.update({ update, token });
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest.data || []}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        getSuggestionValue={this.getAddressSuggestionValue}
        renderSuggestion={this.renderAddressSuggestion}
        inputProps={{ ...this.doneByProps as TODO, value: this.state.value }}
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
