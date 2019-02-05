import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Autosuggest from 'react-autosuggest';
import config from '../../config';
import suggest$Fn, { update$, clear$ } from './personSuggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';
import { personDet } from '../../models/object/classHist';
import * as FontAwesome from 'react-fontawesome';
import { History } from 'history';

export interface PersonNameSuggestComponentProps {
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
  history: History;
  labelText?: string;
  hideCreateNewPerson?: boolean;
  horizontal?: boolean;
}

/* Old:
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeHolder: PropTypes.string,
    suggest: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    update: PropTypes.func,
    disabled: PropTypes.bool,
    clear: PropTypes.func,
    appSession: PropTypes.object.isRequired
  };
  */

export interface PersonNameSuggestComponentState {
  value?: string;
  suggestions?: PersonNameSuggestion[];
  disabled: Boolean;
}

export interface PersonNameSuggestion {
  firstName: string;
  lastName?: string;
  title?: string;
  name: string;
  actorUuid: string;
  actorNameUuid: string;
  defaultName: string;
  displayPersonName?: string;
}

export class PersonNameSuggestComponent extends React.Component<
  PersonNameSuggestComponentProps,
  PersonNameSuggestComponentState
> {
  constructor(props: PersonNameSuggestComponentProps) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value ? props.value : '',
      disabled: this.props && this.props.disabled ? true : false
    };

    this.getFormatedDisplaySuggestions = this.getFormatedDisplaySuggestions.bind(this);
  }
  componentWillReceiveProps(next: PersonNameSuggestComponentProps) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value }));
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
    onChange: (event: TODO, { newValue, method }: TODO) => {
      console.log(newValue, method);
      if (method === 'type') {
        this.setState(ps => {
          return { ...ps, value: newValue };
        });
      }
    }
  };
  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = this.props.appSession.accessToken;
      this.props.update({ update, museumId, token });
    }
  }

  getFormatedDisplaySuggestions(suggestions: PersonNameSuggestion[]) {
    const personList = suggestions.filter((suggestion: PersonNameSuggestion) => {
      return suggestion.defaultName === suggestion.name;
    });

    return personList;

    /*  let i,
      j = 0;
    let newList: PersonNameSuggestion[] = [];

    for (i = 0; i < personList.length; i++) {
      for (j = 0; j < suggestions.length; j++) {
        if (personList[i].actorUuid === '') {
          // PersonName only
          console.log('######## PR CASE 01');
          newList.push({
            defaultName: suggestions[i].defaultName,
            displayPersonName: suggestions[i].defaultName + ' (' + j + ') ',
            actorUuid: suggestions[i].actorUuid,
            actorNameUuid: suggestions[i].actorNameUuid,
            name: suggestions[i].name,
            firstName: suggestions[i].firstName,
            lastName: suggestions[i].lastName,
            title: suggestions[i].title
          });
        } else if (personList[i].actorUuid === suggestions[j].actorUuid) {
          if (personList[i].defaultName === suggestions[j].name) {
            // Person exist
            console.log('######## PR CASE 02');
            newList.push({
              defaultName: suggestions[i].defaultName,
              displayPersonName: suggestions[i].defaultName + ' (' + j + ') ',
              actorUuid: suggestions[i].actorUuid,
              actorNameUuid: suggestions[i].actorNameUuid,
              name: suggestions[i].name,
              firstName: suggestions[i].firstName,
              lastName: suggestions[i].lastName,
              title: suggestions[i].title
            });
          } else if (personList[i].defaultName !== suggestions[j].name) {
            // Person and synonym for the Person
            console.log('######## PR CASE 03');
            newList.push({
              defaultName: suggestions[i].defaultName,
              displayPersonName: suggestions[i].defaultName + ' (' + j + ') ',
              actorUuid: suggestions[i].actorUuid,
              actorNameUuid: suggestions[j].actorNameUuid,
              name: suggestions[j].name,
              firstName: suggestions[j].firstName,
              lastName: suggestions[j].lastName,
              title: suggestions[j].title
            });
          }
        }
      }
    }

    return newList; */
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <Autosuggest
            suggestions={this.getFormatedDisplaySuggestions(
              this.props.suggest.data || []
            ).sort((a: PersonNameSuggestion, b: PersonNameSuggestion) => {
              if (a.defaultName <= b.defaultName) {
                return -1;
              }
              return 1;
            })}
            onSuggestionsFetchRequested={this.requestSuggestionUpdate}
            onSuggestionsClearRequested={() => this.setState(() => ({ suggestions: [] }))}
            getSuggestionValue={(suggestion: personDet) => suggestion.name}
            renderSuggestion={(suggestion: PersonNameSuggestion) => {
              console.log('PersonName suggesstions ', suggestion);
              return this.props.renderFunc(suggestion);
            }}
            inputProps={{
              ...(this.PersonNameProps as TODO),
              value: this.state.value,
              disabled: this.state.disabled ? this.state.disabled : false
            }}
            shouldRenderSuggestions={v => (v ? v.trim().length > 2 : false)}
            onSuggestionSelected={(event, { suggestion, method }) => {
              if ((event as React.KeyboardEvent<HTMLFormElement>).keyCode === 13) {
                event.preventDefault();
              }
              if (method === 'click') {
                this.props.onChange(suggestion);
              }
            }}
          />
        </div>
        {!this.props.hideCreateNewPerson && (
          <div className={this.props.hideCreateNewPerson ? 'col-md-0' : 'col-md-3'}>
            <label htmlFor="btnAddPerson">Create new</label>
            <button
              className="btn btn-default form-control"
              disabled={this.state && this.state.disabled ? true : false}
              onClick={e => {
                let url: string;
                if (this.state && this.state.value === '') {
                  url = config.magasin.urls.client.person.addNewPersonNameBlank(
                    this.props.appSession
                  );
                } else {
                  url = config.magasin.urls.client.person.addNewPersonName(
                    this.props.appSession,
                    this.state.value ? this.state.value : ''
                  );
                }
                e.preventDefault();
                this.props.history && this.props.history.push(url);
              }}
            >
              <FontAwesome name="user-plus" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
const suggest$ = suggest$Fn('personNameSuggest', config.api.persons.searchUrl);
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

export const PersonNameSuggest = inject({ suggest$ }, commands)(
  PersonNameSuggestComponent
);

export default inject(data, commands)(PersonNameSuggestComponent);
