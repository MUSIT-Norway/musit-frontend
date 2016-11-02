import React from 'react'
import Autosuggest from 'react-autosuggest'

export default class ActorSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    update: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    clear: React.PropTypes.func
  }

  static defaultProps = {
    id: 'doneByField',
    disabled: false
  }

  constructor(props) {
    super(props)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.state = {
      value: this.props.value
    }
  }

  onChange(event, { newValue }) {
    this.setState({ ...this.state, value: newValue })
  }

  onSuggestionSelected(event, { suggestion }) {
    if (event.keyCode === 13) {
      event.preventDefault()
    }
    this.props.onChange(suggestion)
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this)
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.props.suggest}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={this.props.update}
        getSuggestionValue={(suggestion) => suggestion.fn}
        renderSuggestion={(suggestion) => <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>}
        inputProps={{ ...this.doneByProps, value: this.state.value, onBlur: this.props.clear }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}