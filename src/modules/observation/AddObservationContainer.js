import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import AddObservationPage from './AddObservationPage';
import { hashHistory } from 'react-router';
import { addObservation } from './observationReducer';
import { loadRoot } from '../storagefacility/reducers/grid/nodes';
import { emitError, emitSuccess } from '../../shared/errors/emitter';

const mapStateToProps = (state) => {
  return {
    actor: state.auth.user.actor,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data,
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveObservation: (id, data, museumId) => {
      dispatch(addObservation(id, museumId, data, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
        },
        onFailure: (e) => emitError({ ...e, type: 'network' })
      }));
    },
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddObservationPage);
