import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import AddObservationPage from '../../components/observation/add';
import { hashHistory } from 'react-router';
import { addObservation } from '../../reducers/observation';
import { actions, rootNodeSelector } from '../../magasin';
const { loadRoot } = actions;
import { emitError, emitSuccess } from '../../util/errors/emitter';

const mapStateToProps = (state) => {
  return {
    actor: state.auth.user.actor,
    rootNode: rootNodeSelector(state.magasinReducers),
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
