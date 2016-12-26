import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { load, update } from '../../../reducers/storageunit/panel';
import EditStorageUnitContainer from '../../../components/magasin/panel/edit';
import { update as updateState } from '../../../reducers/storageunit/panel/state';
import { emitError, emitSuccess } from '../../../util/errors/emitter';
import { I18n } from 'react-i18nify';
import { loadRoot } from '../../../reducers/storageunit/grid';

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState,
    user: state.auth.user,
    loaded: !!state.storagePanelUnit.loaded,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data || {}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditStorageUnitContainer);
