import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$ } from './personSuggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';

interface PersonSynonymSuggestComponentProps {
  id: string;
  value?: string;
  placeHolder?: string;
  suggest?: TODO;
  onChange: Function;
  onChangeTextField: Function;
  update: Function;
  disabled?: Boolean;
  clear?: Function;
  appSession: AppSession;
  renderFunc: Function;
}

interface PersonSynonymSuggestComponentState {
  value?: string;
  suggestions?: PersonSynonymSuggestion[];
  disabled: Boolean;
}

interface PersonSynonymSuggestion {
  personUuid: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  personAttribute: {
     legalEntityType: string;
     url: string;
     externalIds: string[] }[];
  synonyms: [
      {
        personNameUuid: "4dbb83a2-c736-4dc7-a5ad-01da43393e12",
        firstName: string;
        lastName: string;
        name: string;
        isDeleted: boolean;
      }],
      collections: [{ 
        museumId: number;
        collectionId: number }]
  }


export class PersonSynonymSuggestComponent extends React.Component<
  PersonSynonymSuggestComponentProps,
  PersonSynonymSuggestComponentState
> {
  constructor(props: PersonSynonymSuggestComponentProps) {
    super(props);
    console.log('PersonSynonymSuggestComponentProps constructor',props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value,
      disabled: this.props && this.props.disabled ? true : false
    };
  }
  componentWillReceiveProps(next: any) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value, disabled: true }));
      console.log('componentWillReceiveProps nextValue ', next.getSuggestionValue);
    }
    if (next.disabled !== this.props.disabled) {
      this.setState(ps => ({ ...ps, disabled: next.disabled ? next.disabled : false }));
    }
  }
  PersonNameProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event: TODO, { newValue }: TODO) => {
      console.log('PersonNameProps newValue ', newValue);
      this.setState(ps => {
        return { ...ps, value: newValue };
      });
    }
  };
  requestSuggestionUpdate(update: TODO) {
    console.log('requestSuggestionUpdate', update);
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = undefined;
      this.props.update({ update, museumId, token });
    }
  }
  render() {
    return (
      <div>
        <div className="col-md-9">
          <div className="form-group">
            <label htmlFor="personName">Det</label>
            <Autosuggest
              suggestions={(this.props.suggest.data || []).sort(
                (a: PersonSynonymSuggestion, b: PersonSynonymSuggestion) => {
                  if (a.name <= b.name) {
                    return -1;
                  }
                  return 1;
                }
              )}
              onSuggestionsFetchRequested={this.requestSuggestionUpdate}
              onSuggestionsClearRequested={() =>
                this.setState(() => ({ suggestions: [] }))
              }
              getSuggestionValue={(suggestion: PersonSynonymSuggestion) => suggestion.name}
              renderSuggestion={(suggestion: PersonSynonymSuggestion) =>
                this.props.renderFunc(suggestion)
              }
              inputProps={{
                ...(this.PersonNameProps as TODO),
                value: this.state.value,
                disabled: this.state.disabled ? this.state.disabled : false
              }}
              shouldRenderSuggestions={v => v !== 'undefined'}
              onSuggestionSelected={(event, { suggestion }) => {
                if ((event as React.KeyboardEvent<HTMLFormElement>).keyCode === 13) {
                  event.preventDefault();
                }
                this.setState(ps => ({ ...ps, value: '' }));
                this.props.onChange(suggestion);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
const suggest$ = suggest$Fn('PersonSynonymSuggestion', Config.api.persons.searchPersonBySynonymOrName);

const commands = { update$, clear$ };

export default inject({ suggest$ }, commands)(PersonSynonymSuggestComponent);

//export default inject(data, commands)(PersonSynonymSuggestComponent);
