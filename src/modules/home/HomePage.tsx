// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Button,
  FormGroup,
  FormControl,
  InputGroup,
  PageHeader,
  Col
} from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import * as FontAwesome from 'react-fontawesome';
import './index.css';
import Config from '../../config';
import Logos from '../../components/logos/Logos';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';

const reportURL = Config.magasin.urls.client.report.goToReport;
const magasinURL = Config.magasin.urls.client.magasin.goToMagasin;
const analysisURL = Config.magasin.urls.client.analysis.addAnalysis;
const aboutURL = '/about';
const notFoundURL = '/notfound';

type Props = {
  appSession: AppSession;
  goToNotFound: () => void;
  goToAbout: () => void;
  goTo: (url: string) => void;
};

const buttonAdd = (t: TODO, onClick: TODO) => (
  <Button style={{ fontSize: '3.2em' }} className="button" onClick={onClick}>
    {t} <FontAwesome name="chevron-right" />
  </Button>
);

export const HomePage = (props: Props) => (
  <Grid>
    <Row>
      <PageHeader>{I18n.t('musit.texts.musitBase')}</PageHeader>
    </Row>
    <Row>
      <form>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" />
            <InputGroup.Addon>
              <FontAwesome className="buttonIcon" name="search" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </form>
    </Row>
    <Row className="buttonRow">
      <Col md={6}>
        {buttonAdd(
          I18n.t('musit.texts.magazine'),
          props.goTo(magasinURL(props.appSession))
        )}
      </Col>
      <Col>
        {buttonAdd(
          I18n.t('musit.analysis.analysis'),
          props.goTo(analysisURL(props.appSession))
        )}
      </Col>
    </Row>

    <Row className="buttonRow">
      <Col md={6}>
        {buttonAdd(
          I18n.t('musit.reports.reports'),
          props.goTo(reportURL(props.appSession))
        )}
      </Col>
    </Row>
    <Row>
      <div style={{ height: '300px' }} />
      <div style={{ textAlign: 'center', height: '80px' }}>
        {I18n.t('musit.texts.footerText')}
      </div>
      <div style={{ textAlign: 'center', height: '50px' }}>
        <Col md={4} mdOffset={2}>
          <Button bsStyle="link" onClick={props.goToNotFound}>
            {I18n.t('musit.texts.aboutMusitSolutions')}
          </Button>
        </Col>
        <Col md={4}>
          <Button bsStyle="link" onClick={props.goToAbout}>
            {I18n.t('musit.texts.abuotMusit')}
          </Button>
        </Col>
      </div>
      <div style={{ textAlign: 'center', height: '100px' }}>
        <Logos />
      </div>
    </Row>
  </Grid>
);

const data = {
  appSession$: { type: PropTypes.object.isRequired }
};

const props = (props: TODO) => ({
  ...props,
  goToNotFound: () => props.history.push(notFoundURL),
  goToAbout: () => props.history.push(aboutURL),
  goTo: (url: string) => () => props.history.push(url)
});

export default inject(data, {}, props)(HomePage);
