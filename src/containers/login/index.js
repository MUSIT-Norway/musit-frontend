const styles = require('./index.scss');
import 'react-select/dist/react-select.css'
import React, { Component } from 'react'
import LoginButton from '../../components/login-button'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import Language from '../../components/language'
import { connectUser, loadActor } from '../../reducers/auth'


const mapStateToProps = (state) => {
  I18n.loadTranslations(state.language.data)
  I18n.setLocale('no')
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    user: state.auth.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => {
    dispatch(connectUser(user))
    dispatch(loadActor())
  },
})

@connect(mapStateToProps, mapDispatchToProps)

@connect(mapStateToProps)

export default class Login extends Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired,
  };
  render() {
    return (
      <div>
        <div className={styles.border}>
          <div className={styles.musittext}>
            <LoginButton setUser={this.props.setUser}>
              {this.props.translate('musit.login', true)}
            </LoginButton>
            <h3>{this.props.translate('musit.welcomePage.maintitle')}</h3>
            <h5>{this.props.translate('musit.welcomePage.subtitle')}</h5>
          </div>
          <div className={styles.images}>
            <img className={styles.image} src="../../assets/museum-images/UiS_nor_color_rgb.jpg" role="presentation" />
            <img className={styles.image} src="../../assets/museum-images/UiO_SAMARB_2_rgb.jpg" role="presentation" />
            <img
              className={styles.image} src="../../assets/museum-images/UiT_samarbeidslogo_bokmal_300ppi.png"
              role="presentation"
            />
            <img className={styles.image} src="../../assets/museum-images/UiBmerke_grayscale.png" role="presentation" />
          </div>
        </div>
      </div>
    );
  }
}
