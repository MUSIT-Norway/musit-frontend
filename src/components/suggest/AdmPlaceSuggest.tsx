import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import { AppSession } from '../../types/appSession';
import { Observable } from 'rxjs';
import { simpleGet } from '../../shared/RxAjax';
import { createStore } from 'react-rxjs';
import { createActions } from '../../shared/react-rxjs-patch';
import { TODO } from '../../types/common';
import { AdmPlace } from '../../models/object/place';
import config from '../../config';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';

const { update$, clear$ } = createActions('update$', 'clear$');

const suggest$Fn = (name: TODO, urlFn: TODO) =>
  createStore(
    name,
    Observable.empty().merge(
      clear$.map(() => () => ({ data: [] })),
      update$
        .debounce(() => Observable.timer(500))
        .distinctUntilChanged()
        .switchMap(({ update: { value }, token }) =>
          simpleGet(urlFn(value), token)
            .map(({ response }) => response)
            .catch(() => [])
        )
        .map(suggestions => (state: TODO) => ({ ...state, data: suggestions }))
    ) as TODO,
    {}
  );

export type AdmPlaceSuggestions = AdmPlace[];

export interface AdmPlaceSuggestionState {
  value?: string;
  data?: AdmPlaceSuggestions;
  disabled?: Boolean;
}

export interface AdmPlaceSuggestProps {
  id: string;
  value?: string;
  placeHolder?: string;
  filter?: string;
  suggest?: TODO;
  onChange: Function;
  onChangeTextField: Function;
  update: Function;
  disabled?: Boolean;
  clear?: Function;
  appSession: AppSession;
  renderFunc: Function;
  history: History;
}

export class AdmPlaceSuggestion extends React.Component<
  AdmPlaceSuggestProps,
  AdmPlaceSuggestionState
> {
  constructor(props: AdmPlaceSuggestProps) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value,
      disabled: this.props && this.props.disabled ? true : false
    };
  }
  componentWillReceiveProps(next: AdmPlaceSuggestProps) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value }));
    }
    if (next.disabled !== this.props.disabled) {
      this.setState(ps => ({ ...ps, disabled: false }));
    }
  }
  AdmPlaceProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event: TODO, { newValue }: TODO) => {
      console.log('OnChange', newValue);
      this.setState(ps => {
        return { ...ps, value: newValue };
      });
    }
  };
  requestSuggestionUpdate(update: TODO) {
    if (update.value.length >= 2) {
      const token = this.props.appSession.accessToken;
      this.props.update({ update, token });
    }
  }
  render() {
    return (
      <Autosuggest
        suggestions={(this.props.suggest.data || [])
          .filter((a: AdmPlace) => {
            return this.props.filter
              ? a.path.includes(this.props.filter) || this.props.filter === 'alle'
              : true;
          })
          .sort((a: AdmPlace, b: AdmPlace) => {
            if (a.name <= b.name) {
              return -1;
            }
            return 1;
          })}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        onSuggestionsClearRequested={() => this.setState(() => ({ data: [] }))}
        getSuggestionValue={(suggestion: AdmPlace) => suggestion.name}
        renderSuggestion={(suggestion: AdmPlace) => this.props.renderFunc(suggestion)}
        inputProps={{
          ...(this.AdmPlaceProps as TODO),
          value: this.state.value,
          disabled: this.state.disabled ? this.state.disabled : false
        }}
        shouldRenderSuggestions={v => v !== 'undefined'}
        onSuggestionSelected={(event, { suggestion }) => {
          if ((event as React.KeyboardEvent<HTMLFormElement>).keyCode === 13) {
            event.preventDefault();
          }
          this.props.onChange(suggestion);
        }}
      />
    );
  }
}

const suggest$ = suggest$Fn('admPlaceSuggest', config.api.places.searchAdmPlaceURL);

const commands = { update$, clear$ };

export default inject({ suggest$ }, commands)(AdmPlaceSuggestion);
