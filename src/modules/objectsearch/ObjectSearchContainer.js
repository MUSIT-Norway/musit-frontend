import * as actions from './actions';
import Component from './ObjectSearchComponent';
import { connect } from 'react-redux';
import { addObject, loadMainObject } from '../picklist/picklistReducer';

const mapStateToProps = (state) => {
  return {
    data: state.objectSearch.data,
    user: state.auth.user,
    params: state.objectSearch.params,
    currentPage: state.objectSearch.currentPage,
    loaded: state.objectSearch.loaded,
    loading: state.objectSearch.loading
  };
};

const pickObject = (dispatch) => (object, path, museumId, collectionId) => {
  if (object.mainObjectId) {
    dispatch(loadMainObject(object, museumId, collectionId, {
      onSuccess: (children) => {
        children.forEach(child => dispatch(addObject(child, path)));
      }
    }));
  } else {
    dispatch(addObject(object, path));
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (params, page, museumId, collectionId) => dispatch(actions.searchForObjects(params, page, museumId, collectionId)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value)),
    pickObjects: (objects, museumId, collectionId) => objects.forEach(object =>
      pickObject(dispatch)(object, object.breadcrumb, museumId, collectionId)
    ),
    pickObject: pickObject(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

