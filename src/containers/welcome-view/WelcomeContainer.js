import './style.css'
import React from 'react'
import { Panel, Grid, Row } from 'react-bootstrap'
import LoginButton from '../../components/login-button'
import Logo1 from './icons/UiS_nor_color_rgb.png'
import Logo2 from './icons/UiO_SAMARB_rgb_gjennomsiktig.png'
import Logo3 from './icons/UiT_samarbeidslogo_bokmal_300ppi.png'
import Logo4 from './icons/UiBmerke_grayscale.png'
import Logo5 from './icons/ntnu_u-slagord.png'

export default class WelcomeContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <div className="welcomePanel">
                  <div>
                    {!this.props.user &&
                      <LoginButton
                        setUser={this.props.setUser}
                      >
                        {this.props.translate('musit.login', true)}
                      </LoginButton>
                    }

                    <div className="title">
                      <p>MUSIT</p>
                      <p>Universitetsmuseenes samlingsdatabaser</p>
                    </div>

                    <div className="logos">
                      <img style={{ height: '60px' }} alt="logo" src={Logo1} />
                      <img style={{ height: '60px' }} alt="logo" src={Logo2} />
                      <img style={{ height: '60px' }} alt="logo" src={Logo3} />
                      <img style={{ height: '60px' }} alt="logo" src={Logo4} />
                      <img style={{ height: '60px' }} alt="logo" src={Logo5} />
                    </div>
                  </div>
                </div>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    );
  }
}
