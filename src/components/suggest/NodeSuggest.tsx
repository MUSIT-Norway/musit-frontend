import * as React from 'react';
import * as AutoSuggest from 'react-autosuggest';
import Config from '../../config';
import suggest$Fn, { update$, clear$ } from './suggestStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { AppSession } from '../../types/appSession';
import { TODO, MUSTFIX } from '../../types/common';

/* Old:
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
interface NodeSuggestProps {
  appSession: AppSession;
  id: string; // PropTypes.string.isRequired,
  value?: string; //PropTypes.string,
  placeHolder?: string; // PropTypes.string,
  suggest?: object; // PropTypes.object,
  onChange: Function; // PropTypes.func.isRequired,
  update: Function; // PropTypes.func,
  disabled?: boolean; // PropTypes.bool,
  clear?: Function; // PropTypes.func
}

interface NodeSuggestState {
  value?: string;
}

interface NodeSuggestion {
  name: string;
}

export class NodeSuggest extends React.Component<NodeSuggestProps, NodeSuggestState> {
  static defaultProps = {
    id: 'nodeField',
    disabled: false,
    value: ''
  };

  constructor(props: NodeSuggestProps) {
    super(props);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.requestSuggestionUpdate = this.requestSuggestionUpdate.bind(this);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps: NodeSuggestProps) {
    if (nextProps.value !== this.props.value) {
      this.setState(ps => ({ ...ps, value: nextProps.value }));
    }
  }

  onChange(event: TODO, { newValue }: TODO) {
    this.setState(ps => ({ ...ps, value: newValue }));
  }

  onSuggestionSelected(event: TODO, { suggestion }: TODO) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
    this.props.onChange(suggestion.nodeId);
  }

  getNodeSuggestionValue(suggestion: NodeSuggestion) {
    return suggestion.name;
  }

  nodeProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this),
    onBlur: this.props.clear
  };

  renderNodeSuggestion(suggestion: NodeSuggestion) {
    const suggestionText = suggestion.name;
    return <span className={'suggestion-content'}>{suggestionText}</span>;
  }

  requestSuggestionUpdate(update: TODO) {
    if (update.value.length > 2) {
      const museumId = this.props.appSession.museumId;
      const token = this.props.appSession.accessToken;
      this.props.update({ update, museumId, token });
    }
  }

  render() {
    return (
      <AutoSuggest
        suggestions={(this.props.suggest as MUSTFIX).data || []}
        //disabled={this.props.disabled}
        onSuggestionsFetchRequested={this.requestSuggestionUpdate}
        getSuggestionValue={this.getNodeSuggestionValue}
        renderSuggestion={this.renderNodeSuggestion}
        inputProps={{ ...this.nodeProps, value: this.state.value } as TODO}
        shouldRenderSuggestions={v => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

const data = {
  suggest$: suggest$Fn('nodeSuggest', Config.magasin.urls.api.storagefacility.searchUrl)
};

const commands = { update$, clear$ };

export default inject(data, commands)(NodeSuggest);
