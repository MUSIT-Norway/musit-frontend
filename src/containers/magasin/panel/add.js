import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { insert } from '../../../reducers/storageunit/panel';
import StorageUnitAddContainer from '../../../components/magasin/panel/add';
import { clear as clearState, update as updateState } from '../../../reducers/storageunit/panel/state';
import { emitSuccess } from '../../../errors/emitter';
import { I18n } from 'react-i18nify';
import { loadRoot } from '../../../reducers/storageunit/grid';

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (parentId, data) => {
      dispatch(insert(parentId, data, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess(
            {
              type: 'saveSuccess',
              message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')
            }
          );
        },
        onFailure: () => false
      }));
    },
    updateState: (data) => dispatch(updateState(data)),
    clearState: () => dispatch(clearState()),
    loadStorageObj: (id) => {
      dispatch(loadRoot(id));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState,
    error: state.storagePanelUnit.error,
    loaded: !!state.storagePanelUnit.loaded,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data || {}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitAddContainer);
