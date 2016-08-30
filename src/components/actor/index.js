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
  onDoneBySuggestionsUpdateRequested: (id, { value, reason }) => {
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
    suggest: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDoneBySuggestionsUpdateRequested: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
  }

  static defaultProps = {
    id: 'doneByField',
    disabled: false
  }

  getSuggestions() {
    const suggest = this.props.suggest[this.props.id];
    return suggest && suggest.data ? suggest.data : []
  }

  doneByProps = {
    id: 'doneByField',
    placeholder: 'Done by',
    value: this.props.value,
    type: 'search',
    onChange: this.props.onChange
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.getSuggestions()}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={(update) =>
          this.props.onDoneBySuggestionsUpdateRequested(this.props.id, update)
        }
        getSuggestionValue={(suggestion) => suggestion.fn}
        renderSuggestion={(suggestion) => <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>}
        inputProps={this.doneByProps}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}
