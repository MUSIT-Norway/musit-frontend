import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';

import { loadObservation } from './observationReducers';

import { emitError, emitSuccess } from '../../util/errors/emitter';

import EditObservationPage from './ObservationEditComponent';

import Magasin from '../magasin/index';
import Control from '../control/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;
const { addControl } = Control.actions;

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    rootNode: rootNodeSelector(state.magasin)
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
