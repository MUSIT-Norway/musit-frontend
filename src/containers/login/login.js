const styles = require('./login.scss');
import 'react-select/dist/react-select.css'
import React, { Component } from 'react'
import LoginButton from '../../components/login-button'
import { hashHistory } from 'react-router'

export default class Login extends Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired,
    loadUser: React.PropTypes.func.isRequired
  };

  componentWillMount() {
    const loaded = this.props.loadUser()
    if (loaded) {
      hashHistory.replace('/musit')
    }
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.border}>
          <div className={styles.text}>
            <LoginButton setUser={this.props.setUser}>
              {this.props.translate('musit.login', true)}
            </LoginButton>
            <h1>{this.props.translate('musit.welcomePage.maintitle')}</h1>
            <h3>{this.props.translate('musit.welcomePage.subtitle')}</h3>
          </div>
          <div className={styles.images}>
            <img className={styles.image} src="../../assets/museum-images/UiS_nor_color_rgb.jpg" role="presentation" />
            <img className={styles.image} src="../../assets/museum-images/UiO_SAMARB_2_rgb.jpg" role="presentation" />
            <img
              className={styles.image} src="../../assets/museum-images/UiT_samarbeidslogo_bokmal_300ppi.png"
              role="presentation"
            />
            <img className={styles.image} src="../../assets/museum-images/UiBmerke_grayscale.png" role="presentation" />
            <img className={styles.image} src="../../assets/museum-images/ntnu_u-slagord.png" role="presentation" />
          </div>
        </div>
      </div>
    );
  }
}
