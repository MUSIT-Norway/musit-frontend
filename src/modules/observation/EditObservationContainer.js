import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import EditObservationPage from './EditObservationPage';
import { loadObservation } from './observationReducer';
import { addControl } from '../control/controlReducer';
import { hashHistory } from 'react-router';
import { loadRoot } from '../storagefacility/reducers/grid/nodes';
import { emitError, emitSuccess } from '../../shared/errors/emitter';

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data,
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
          emitSuccess( { type: 'saveSuccess', message: controlState ?
              I18n.t('musit.newControl.saveControlSuccess') :
              I18n.t('musit.observation.page.messages.saveSuccess') });
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
