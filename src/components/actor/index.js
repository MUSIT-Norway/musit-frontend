import React from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import Autosuggest from 'react-autosuggest'
import { suggestPerson, clearSuggest } from '../../reducers/suggest'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  suggest: state.suggest
})

const mapDispatchToProps = (dispatch) => ({
  onUpdateRequested: (id, { value, reason }) => {
    if (reason && (reason === 'type') && value && value.length >= 2) {
      dispatch(suggestPerson(id, value))
    } else {
      dispatch(clearSuggest(id))
    }
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class ActorSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onUpdateRequested: React.PropTypes.func,
    disabled: React.PropTypes.bool
  }

  static defaultProps = {
    id: 'doneByField',
    disabled: false,
  }

  constructor(props) {
    super(props)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.state = {
      value: this.props.value
    }
  }

  onCHange(event, { newValue }) {
    this.setState({ ...this.state, value: newValue })
  }

  onSuggestionSelected(event, { suggestion }) {
    this.props.onChange(suggestion)
  }

  getSuggestions() {
    const suggest = this.props.suggest[this.props.id];
    return suggest && suggest.data ? suggest.data : []
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onCHange.bind(this)
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.getSuggestions()}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={(update) => this.props.onUpdateRequested(this.props.id, update)}
        getSuggestionValue={(suggestion) => suggestion.fn}
        renderSuggestion={(suggestion) => <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>}
        inputProps={{ ...this.doneByProps, value: this.state.value }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}
