import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import { clearUser, connectUser, clearActor, loadActor } from '../../reducer/auth'
import jwtDecode from 'jwt-decode'
import { TYPES as PICK_TYPES } from '../../reducer/picklist'
import AppLayout from './AppLayout'

const mapStateToProps = (state) => {
  I18n.loadTranslations(state.language.data)
  I18n.setLocale('no')
  return {
    user: state.auth.user,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => {
      localStorage.removeItem('jwtToken')
      dispatch(clearUser())
      dispatch(clearActor())
    },
    loadUser: () => {
      if (localStorage.getItem('jwtToken')) {
        const user = jwtDecode(localStorage.getItem('jwtToken'))
        dispatch(connectUser(user))
        dispatch(loadActor())
        return true
      }
      if (localStorage.getItem('fakeToken')) {
        const userId = JSON.parse(localStorage.getItem('fakeToken')).userId
        const user = require('../../../fake_security.json').users.find(u => u.userId === userId)
        dispatch(connectUser(user))
        dispatch(loadActor())
        return true
      }
      return false
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
