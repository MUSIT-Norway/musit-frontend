import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { load, update } from './storageActions';
import EditNode from './StorageEditComponent';
import { updateState } from './storageActions';
import { emitError, emitSuccess } from '../../util/errors/emitter';
import { loadRoot } from '../magasin/magasinActions';
import { rootNodeSelector } from '../magasin/magasinReducers';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    unit: state.storagePanelUnit.state,
    loaded: !!state.storagePanelUnit.loaded,
    rootNode: rootNodeSelector(state.magasinReducers)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (data, museumId) => {
      dispatch(update(data, museumId, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess(
            {
              type: 'saveSuccess',
              message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')
            }
          );
        },
        onFailure: (e) => {
          emitError({...e, type: 'network'});
        }
      }));
    },
    loadStorageUnit: (id, museumId, callback) => {
      dispatch(load(id, museumId, callback));
    },
    updateState: (data) => dispatch(updateState(data)),
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNode);
