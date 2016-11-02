import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { load, update } from '../../../reducers/storageunit/panel';
import EditStorageUnitContainer from '../../../components/magasin/panel/edit'
import { update as updateState } from '../../../reducers/storageunit/panel/state'
import { emitError, emitSuccess } from '../../../errors/emitter'
import { I18n } from 'react-i18nify'
import { loadRoot } from '../../../reducers/storageunit/grid'

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState,
    loaded: !!state.storagePanelUnit.loaded,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (data) => {
      dispatch(update(data, {
        onSuccess: () => {
          hashHistory.goBack()
          emitSuccess({ type: 'saveSuccess', message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')})
        },
        onFailure: () => { emitError( { type: 'errorOnSave', message: this.props.translate('musit.storageUnits.messages.saveNodeError') })}
      }))
    },
    loadStorageUnit: (id, callback) => {
      dispatch(load(id, callback))
    },
    updateState: (data) => dispatch(updateState(data)),
    loadStorageObj: (id) => {
      dispatch(loadRoot(id))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStorageUnitContainer)
