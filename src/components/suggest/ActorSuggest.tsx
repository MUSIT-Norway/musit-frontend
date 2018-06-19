import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Autosuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO, MUSTFIX } from '../../types/common';

type ActorSuggestProps = {
  id: string; // PropTypes.string.isRequired,
  value?: string; // PropTypes.string,
  placeHolder?: string; // PropTypes.string,
  suggest?: object;
  onChange: Function; // PropTypes.func.isRequired,
  update?: Function; // PropTypes.func,
  disabled?: boolean; // PropTypes.bool,
  clear?: Function; // PropTypes.func,
  appSession: AppSession; // PropTypes.object.isRequired
};

type ActorSuggestState = {
  value: TODO;
};

/*OLD 

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

export class ActorSuggestComponent extends React.Component<
  ActorSuggestProps,
  ActorSuggestState
> {
  constructor(props: ActorSuggestProps) {
    super(props);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(next: ActorSuggestProps) {
    if (next.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: next.value }));
    }
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onBlur: this.props.clear,
    onChange: (event: TODO, { newValue }: TODO) =>
      this.setState(ps => ({ ...ps, value: newValue }))
  };

  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = this.props.appSession.accessToken;
      (this.props as MUSTFIX).update({ update, museumId, token });
    }
  }

  render() {
    return (
      <Autosuggest
        suggestions={(this.props.suggest as MUSTFIX).data || []}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        //TODO: Is this needed?: onSuggestionsUpdateRequested={this.requestSuggestionUpdate as TODO}

        /*TODO: disable doesn't exist in AutoSuggest, so I had to remove this: 
        // disabled={this.props.disabled}
        
        */

        getSuggestionValue={suggestion => suggestion.fn}
        renderSuggestion={suggestion => (
          <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>
        )}
        inputProps={
          {
            ...this.doneByProps,
            value: this.state.value
          } as TODO
        }
        shouldRenderSuggestions={v => v !== 'undefined'}
        onSuggestionSelected={(event: TODO, { suggestion }) => {
          if (event.keyCode === 13) {
            event.preventDefault();
          }
          this.props.onChange(suggestion);
        }}
      />
    );
  }
}

const suggest$ = suggest$Fn('actorSuggest', Config.magasin.urls.api.actor.searchUrl);

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

export const ActorSuggest = inject({ suggest$ }, commands)(ActorSuggestComponent);

export default inject(data, commands)(ActorSuggestComponent);
