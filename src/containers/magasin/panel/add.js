import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { insert } from '../../../reducers/storageunit/panel';
import StorageUnitAddContainer from '../../../components/magasin/panel/add';
import { clear as clearState, update as updateState } from '../../../reducers/storageunit/panel/state';
import { emitError, emitSuccess } from '../../../util/errors/emitter';
import { I18n } from 'react-i18nify';
import { loadRoot } from '../../../reducers/storageunit/grid';

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (parentId, museumId, data) => {
      dispatch(insert(parentId, museumId, data, {
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
    updateState: (data) => dispatch(updateState(data)),
    clearState: () => dispatch(clearState()),
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState,
    user: state.auth.user,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data || {}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitAddContainer);
