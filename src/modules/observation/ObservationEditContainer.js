import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';

import { loadObservation } from './observationReducers';
import { addControl } from '../control/controlReducer';

import { loadRoot } from '../magasin/magasinActions';
import { rootNodeSelector } from '../magasin/magasinReducers';

import { emitError, emitSuccess } from '../../util/errors/emitter';

import EditObservationPage from './ObservationEditComponent';

const mapStateToProps = (state) => {
  return {
    rootNode: rootNodeSelector(state.magasinReducers),
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id, museumId) => {
    dispatch(loadObservation(id, museumId));
  },
  // Higher order function (or partial function if you like to call it that)
  onSaveObservation: (controlState, museumId) => {
    return (id, observationState) => {
      dispatch(addControl(id, controlState, observationState, museumId, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
        },
        onFailure: (e) => emitError({ ...e, type: 'network' })
      }));
    };
  },
  loadStorageObj: (id, museumId) => {
    dispatch(loadRoot(id, museumId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditObservationPage);
