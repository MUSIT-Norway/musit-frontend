import { connect } from 'react-redux';

import { addObservation } from './observationReducers';

import AddObservationPage from './ObservationAddComponent';

import Magasin from '../magasin/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => ({
  user: state.app.user,
  rootNode: rootNodeSelector(state.magasin)
});

const mapDispatchToProps = {
  onSaveObservation: addObservation,
  loadStorageObj: loadRoot
};

export default connect(mapStateToProps, mapDispatchToProps)(AddObservationPage);
