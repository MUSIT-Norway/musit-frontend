import { connect } from 'react-redux';

import * as actions from './searchActions';
import { addObject } from '../picklist/picklistActions';

import Component from './SearchObjectComponent';

import Magasin from '../magasin/index';

const { loadMainObject } = Magasin.actions;

const mapStateToProps = (state) => ({
  user: state.app.user,
  data: state.search.data,
  params: state.search.params,
  currentPage: state.search.currentPage,
  loaded: state.search.loaded,
  loading: state.search.loading
});

const mapDispatchToProps = (dispatch) => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);

