import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';

export class TaxonSuggestComponent extends React.Component {
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

  constructor(props) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(next) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value }));
    }
  }

  TaxonProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event, { newValue }) =>
      this.setState(ps => {
        return { ...ps, value: newValue };
      })
  };

  requestSuggestionUpdate(update) {
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = undefined;
      this.props.update({ update, museumId, token });
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={(this.props.suggest.data || []).sort((a, b) => {
          if (a.scientificName <= b.scientificName) {
            return -1;
          }
          return 1;
        })}
        disabled={this.props.disabled}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        onSuggestionsClearRequested={() => this.setState(() => ({ suggestions: [] }))}
        getSuggestionValue={suggestion => suggestion.scientificName}
        renderSuggestion={suggestion => (
          <span
            className={'suggestion-content'}
          >{`${suggestion.scientificName} ${suggestion.scientificNameAuthorship != null
            ? suggestion.scientificNameAuthorship
            : ''} ${suggestion.acceptedNameUsage != null
            ? '[=' + suggestion.acceptedNameUsage.scientificName + ']'
            : ''} `}</span>
        )}
        inputProps={{
          ...this.TaxonProps,
          value: this.state.value
        }}
        shouldRenderSuggestions={v => v !== 'undefined'}
        onSuggestionSelected={(event, { suggestion }) => {
          if (event.keyCode === 13) {
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
