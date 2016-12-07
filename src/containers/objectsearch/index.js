import * as actions from '../../reducers/objectsearch/actions';
import Component from '../../components/objectsearch/ObjectSearchComponent';
import { connect } from 'react-redux';
import { addObject } from '../../reducers/picklist';

const mapStateToProps = (state) => {
  return {
    data: state.objectSearch.data,
    user: state.auth.user,
    params: state.objectSearch.params,
    currentPage: state.objectSearch.currentPage,
    loaded: state.objectSearch.loaded
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (params, page, museumId, collectionId) => dispatch(actions.searchForObjects(params, page, museumId, collectionId)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value)),
    pickObject: (object, path) => dispatch(addObject(object, path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

