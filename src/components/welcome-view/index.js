import './style.css';
import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import LoginButton from '../../components/login-button';
import FeideLogo from './assets/feide-login-icon.png';
import { I18n } from 'react-i18nify';
import Logos from '../logos/Logos';

export default class WelcomeContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <main>
          <Grid>
            <Row className="row-centered">
              <div className="welcomePanel">
                <div>
                  {!this.props.user &&
                    <LoginButton
                      setUser={this.props.setUser}
                    >
                      <span>
                        {I18n.t('musit.login')}
                        <img src={FeideLogo} alt="feide-logo-button" title="Feide Login" />
                      </span>
                    </LoginButton>
                  }

                  <div className="title">
                    <p>MUSIT</p>
                    <p>Universitetsmuseenes samlingsdatabaser</p>
                  </div>

                  <Logos style={{ marginTop: 150 }} />
                </div>
              </div>
            </Row>
          </Grid>
        </main>
      </div>
    );
  }
}
