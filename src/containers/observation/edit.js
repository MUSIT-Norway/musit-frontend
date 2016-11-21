import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import EditObservationPage from '../../components/observation/edit';
import { loadObservation } from '../../reducers/observation';
import { addControl } from '../../reducers/control';
import { hashHistory } from 'react-router';
import { loadRoot } from '../../reducers/storageunit/grid';
import { emitError, emitSuccess } from '../../errors/emitter';

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
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
        },
        onFailure: () => emitError({ type: 'errorOnSave', message: I18n.t('musit.observation.page.messages.saveError') })
      }));
    };
  },
  loadStorageObj: (id, museumId) => {
    dispatch(loadRoot(id, museumId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditObservationPage);
