import './style.css';
import React from 'react';
import { Grid, Row, Modal, Button } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './index_no.html.jsx';
import EnglishTranslation from './index_en.html.jsx';
import Logos from '../logos/Logos';
import LoginButton from '../../components/login-button';

const getTranslated = (props, showModal) => {
  const locale = I18n._locale;
  let Component;
  switch (locale) {
  case 'no':
    Component = NorwegianTranslation;
    break;
  default:
    Component = EnglishTranslation;
  }
  return <Component {...props} showModal={showModal} />;
};

class WelcomeContainer extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    setUser: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <main>
          <Grid>
            <Row className="row-centered">
              <div className="welcomePanel">
                <div>
                  {!this.props.user &&
                  <LoginButton setUser={this.props.setUser}>
                    <span>
                      {I18n.t('musit.login')}
                    </span>
                  </LoginButton>
                  }
                  <div className="title">
                    {getTranslated(this.props, () => this.setState({ showModal: true }))}
                  </div>
                  <Logos style={{ marginTop: 100 }}/>
                </div>
              </div>
            </Row>
          </Grid>
        </main>
        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Heisann
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default WelcomeContainer;
