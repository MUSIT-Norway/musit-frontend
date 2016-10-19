import * as actions from '../../reducers/objectsearch/actions'
import Component from '../../components/objectsearch/ObjectSearchComponent'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    data: state.objectSearch.data,
    params: state.objectSearch.params
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (museumNo, uNo, term) => dispatch(actions.searchForObjects(museumNo, uNo, term)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

