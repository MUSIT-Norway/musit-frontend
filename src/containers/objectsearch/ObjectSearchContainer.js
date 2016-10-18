import * as actions from '../../reducers/objectsearch/actions'
import Component from '../../components/objectsearch/ObjectSearchComponent'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    data: state.objectSearch.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (museumNo, uNo, term) => dispatch(actions.searchForObjects(museumNo, uNo, term))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

