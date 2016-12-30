import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';

import { addObservation } from './observationReducers';

import { emitError, emitSuccess } from '../../util/errors/emitter';

import AddObservationPage from './ObservationAddComponent';

import Magasin from '../magasin/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    rootNode: rootNodeSelector(state.magasin)
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
