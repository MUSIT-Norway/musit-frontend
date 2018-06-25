import './LoginComponent.css';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Grid, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './LoginComponent_no.html.jsx';
import EnglishTranslation from './LoginComponent_en.html.jsx';
import Logos from '../../components/logos/Logos';
import LoginButton from './LoginButton';
import TermsAndConditions from './TermsAndConditions';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';

interface LoginComponentProps {
  user: object;
  locale: () => 'no' | 'en';
}

interface LoginComponentState {
  showModal: boolean;
}

/* Old:
static propTypes = {
  user: PropTypes.object
};
*/

export class LoginComponent extends React.Component<
  LoginComponentProps,
  LoginComponentState
> {
  constructor(props: LoginComponentProps) {
    super(props);
    this.state = { showModal: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal(e: Event) {
    e.preventDefault();
    this.setState(() => ({ showModal: true }));
  }

  hideModal(e: Event) {
    e.preventDefault();
    this.setState(() => ({ showModal: false }));
  }

  render() {
    const Translated =
      this.props.locale() === 'no' ? NorwegianTranslation : EnglishTranslation;
    return (
      <div>
        <main>
          <Grid>
            <Row className="row-centered">
              <div className="welcomePanel">
                <div>
                  {!this.props.user && (
                    <LoginButton>
                      <span className="buttonText">{I18n.t('musit.login')}</span>
                    </LoginButton>
                  )}
                  <div className="title">
                    <Translated {...this.props} showModal={this.showModal} />
                  </div>
                  <Logos style={{ marginTop: 100 }} />
                </div>
              </div>
            </Row>
          </Grid>
        </main>
        <TermsAndConditions isVisible={this.state.showModal} hideModal={this.hideModal} />
      </div>
    );
  }
}

export default inject({}, {}, { locale: () => I18n._locale })(LoginComponent);
