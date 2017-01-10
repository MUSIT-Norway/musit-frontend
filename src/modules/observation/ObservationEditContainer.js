import { connect } from 'react-redux';

import { loadObservation } from './observationReducers';

import EditObservationPage from './ObservationEditComponent';

import Magasin from '../magasin/index';
import Control from '../control/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;
const { addControlWithObservations } = Control.actions;

const mapStateToProps = (state) => ({
  user: state.app.user,
  rootNode: rootNodeSelector(state.magasin)
});

const mapDispatchToProps = {
  loadObservation,
  onSaveObservation: addControlWithObservations,
  loadStorageObj: loadRoot
};

export default connect(mapStateToProps, mapDispatchToProps)(EditObservationPage);
