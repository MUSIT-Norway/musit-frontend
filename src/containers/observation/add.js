import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import AddObservationPage from '../../components/observation/add';
import { hashHistory } from 'react-router';
import { addObservation } from '../../reducers/observation';
import { loadRoot } from '../../reducers/storageunit/grid';
import { emitError, emitSuccess } from '../../errors/emitter';

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
    onSaveObservation: (id, museumId, data) => {
      dispatch(addObservation(id, museumId, data, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
        },
        onFailure: () => emitError( { type: 'errorOnSave', message: I18n.t('musit.observation.page.messages.saveError') })
      }));
    },
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddObservationPage);
