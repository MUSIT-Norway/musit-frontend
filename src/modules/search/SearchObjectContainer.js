import { connect } from 'react-redux';

import * as actions from './searchActions';
import { addObject } from '../picklist/picklistActions';
import { loadMainObject } from '../magasin/magasinActions';

import Component from './SearchObjectComponent';

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    data: state.search.data,
    params: state.search.params,
    currentPage: state.search.currentPage,
    loaded: state.search.loaded,
    loading: state.search.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForObjects: (params, page, museumId, collectionId) => dispatch(actions.searchForObjects(params, page, museumId, collectionId)),
    onChangeField: (field, value) => dispatch(actions.onChangeField(field, value)),
    pickObject: (object, path, museumId, collectionId) => {
      if (object.mainObjectId) {
        dispatch(loadMainObject(object, path, museumId, collectionId, {
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

