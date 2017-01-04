import * as actions from '../../reducers/objectsearch/actions';
import Component from '../../components/objectsearch/ObjectSearchComponent';
import { connect } from 'react-redux';
import { addObject, loadMainObject } from '../../reducers/picklist';

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

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (params, page, museumId, collectionId) => dispatch(actions.searchForObjects(params, page, museumId, collectionId)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value)),
    pickObject: (object, path, museumId, collectionId) => {
      if (object.mainObjectId) {
        dispatch(loadMainObject(object, museumId, collectionId, {
          onSuccess: (children) => {
            children.forEach(child => dispatch(addObject(child, path)));
          }
        }));
      } else {
        dispatch(addObject(object, path));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

