import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Autosuggest from 'react-autosuggest';
import config from '../../config';
import suggest$Fn, { update$, clear$ } from './personOrPersonNameSuggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';
import { History } from 'history';
import { PersonNameSuggestion } from './PersonNameSuggest';

export interface PersonOrPersonNameSuggestComponentProps {
  id: string;
  value?: string;
  placeHolder?: string;
  suggest?: TODO;
  onChange?: Function;
  update: Function;
  disabled?: Boolean;
  clear?: Function;
  appSession: AppSession;
  renderFunc: Function;
  history?: History;
  searchType?: string;
}

/* export interface PersonNameSuggestion {
  firstName: string;
  lastName?: string;
  title?: string;
  name: string;
  actorUuid: string;
  actorNameUuid: string;
  defaultName: string;
  displayPersonName?: string;
} */

export interface PersonOrPersonNameSuggestComponentState {
  value?: string;
  suggestions?: PersonNameSuggestion[];
  disabled: Boolean;
}

export class PersonOrPersonNameSuggestComponent extends React.Component<
  PersonOrPersonNameSuggestComponentProps,
  PersonOrPersonNameSuggestComponentState
> {
  constructor(props: PersonOrPersonNameSuggestComponentProps) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value,
      disabled: this.props && this.props.disabled ? true : false
    };
  }

  componentWillReceiveProps(next: PersonOrPersonNameSuggestComponentProps) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value, disabled: true }));
    }
    if (next.disabled !== this.props.disabled) {
      this.setState(ps => ({ ...ps, disabled: next.disabled ? next.disabled : false }));
    }
  }

  PersonOrPersonNameProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event: TODO, { newValue }: TODO) => {
      this.setState(ps => {
        return { ...ps, value: newValue };
      });
    }
  };

  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = this.props.appSession.accessToken;
      this.props.update({ update, museumId, token });
    }
  }

  render() {
    return (
      <div>
        <Autosuggest
          suggestions={this.props.suggest.data || []}
          onSuggestionsFetchRequested={this.requestSuggestionUpdate}
          onSuggestionsClearRequested={() => this.setState(() => ({ suggestions: [] }))}
          getSuggestionValue={(suggestion: PersonNameSuggestion) => suggestion.name}
          renderSuggestion={(suggestion: PersonNameSuggestion) => {
            return this.props.renderFunc(suggestion);
          }}
          inputProps={{
            ...(this.PersonOrPersonNameProps as TODO),
            value: this.state.value,
            disabled: this.state.disabled ? this.state.disabled : false
          }}
          shouldRenderSuggestions={v => v !== 'undefined'}
          onSuggestionSelected={(event, { suggestion }) => {
            if ((event as React.KeyboardEvent<HTMLFormElement>).keyCode === 13) {
              event.preventDefault();
            }
            this.props.onChange && this.props.onChange(suggestion);
          }}
        />
      </div>
    );
  }
}

const suggest$ = suggest$Fn(
  'personOrPersonNameSuggest',
  config.api.persons.searchPersonBySynonymOrName
);
const data = {
  appSession$: {
    type: PropTypes.shape({
      museumId: PropTypes.number.isRequired,
      accessToken: PropTypes.string.isRequired
    }).isRequired
  },
  suggest$
};

const commands = { update$, clear$ };

export const PersonOrPersonNameSuggest = inject({ suggest$ }, commands)(
  PersonOrPersonNameSuggestComponent
);

export default inject(data, commands)(PersonOrPersonNameSuggestComponent);
