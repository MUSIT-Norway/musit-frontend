import { connect } from 'react-redux';

import { loadObservation } from './observationReducers';

import ViewObservationPage from './ObservationViewComponent';

import Magasin from '../magasin/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => ({
  user: state.app.user,
  doneBy: state.observation.data.doneBy,
  doneDate: state.observation.data.doneDate,
  registeredDate: state.observation.data.registeredDate,
  registeredBy: state.observation.data.registeredBy,
  observations: state.observation.data.observations,
  rootNode: rootNodeSelector(state.magasin)
});

const mapDispatchToProps = {
  loadObservation,
  loadStorageObj: loadRoot
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewObservationPage);
