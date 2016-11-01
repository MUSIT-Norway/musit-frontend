import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import EditObservationPage from '../../components/observation/edit'
import { loadObservation } from '../../reducers/observation'
import { addControl } from '../../reducers/control'
import { hashHistory } from 'react-router'
import { loadRoot } from '../../reducers/storageunit/grid'
import { emitError, emitSuccess } from '../../errors/emitter'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id) => {
    dispatch(loadObservation(id))
  },
  // Higher order function (or partial function if you like to call it that)
  onSaveObservation: (controlState) => {
    return (id, observationState) => {
      dispatch(addControl(id, controlState, observationState, {
        onSuccess: () => {
          hashHistory.goBack()
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') })
        },
        onFailure: () => emitError({ type: 'errorOnSave', message: I18n.t('musit.observation.page.messages.saveError') })
      }))
    }
  },
  loadStorageObj: (id) => {
    dispatch(loadRoot(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditObservationPage)
