import * as actions from './actions';
import Component from './ObjectSearchComponent';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    data: state.objectSearch.data,
    params: state.objectSearch.params,
    currentPage: state.objectSearch.currentPage,
    loaded: state.objectSearch.loaded,
    loading: state.objectSearch.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (params, page, museumId, collectionId) => dispatch(actions.searchForObjects(params, page, museumId, collectionId)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
