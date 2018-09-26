import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Autosuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';

interface TaxonSuggestComponentProps {
  id: string;
  value?: string;
  placeHolder?: string;
  suggest?: TODO;
  onChange: Function;
  update: Function;
  disabled?: Boolean;
  clear?: Function;
  appSession: AppSession;
  renderFunc: Function;
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

interface TaxonSuggestComponentState {
  value?: string;
  suggestions?: TaxonSuggestion[];
  disabled: Boolean;
}

interface TaxonSuggestion {
  scientificName: string;
  scientificNameAuthorship: string;
  taxonRank: string;
  acceptedNameUsage: TaxonSuggestion | null;
}

export class TaxonSuggestComponent extends React.Component<
  TaxonSuggestComponentProps,
  TaxonSuggestComponentState
> {
  constructor(props: TaxonSuggestComponentProps) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value,
      disabled: this.props && this.props.disabled ? true : false
    };
  }

  componentWillReceiveProps(next: TaxonSuggestComponentProps) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value }));
    }
    if (next.disabled !== this.props.disabled) {
      this.setState(ps => ({ ...ps, disabled: next.disabled ? next.disabled : false }));
    }
  }

  TaxonProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event: TODO, { newValue }: TODO) =>
      this.setState(ps => {
        return { ...ps, value: newValue };
      })
  };

  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      console.log(' 444444 calling taxonSuggest ');
      const museumId = this.props.appSession.museumId;
      const token = undefined;
      this.props.update({ update, museumId, token });
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={(this.props.suggest.data || []).sort(
          (a: TaxonSuggestion, b: TaxonSuggestion) => {
            if (a.scientificName <= b.scientificName) {
              return -1;
            }
            return 1;
          }
        )}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        onSuggestionsClearRequested={() => this.setState(() => ({ suggestions: [] }))}
        getSuggestionValue={(suggestion: TaxonSuggestion) => suggestion.scientificName}
        renderSuggestion={(suggestion: TaxonSuggestion) =>
          this.props.renderFunc(suggestion)
        }
        inputProps={{
          ...(this.TaxonProps as TODO),
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

const suggest$ = suggest$Fn(
  'taxonSuggest',
  Config.magasin.urls.api.taxon.getLatinNamesMatch
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

export const TaxonSuggest = inject({ suggest$ }, commands)(TaxonSuggestComponent);

export default inject(data, commands)(TaxonSuggestComponent);
