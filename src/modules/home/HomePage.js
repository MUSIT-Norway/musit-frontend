// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Button,
  form,
  FormGroup,
  FormControl,
  InputGroup,
  PageHeader,
  Col
} from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import FontAwesome from 'react-fontawesome';
import './index.css';
import Config from '../../config';
import { hashHistory } from 'react-router';
import Logos from '../../components/logos/Logos';
import inject from 'react-rxjs/dist/RxInject';
import flowRight from 'lodash/flowRight';
import { makeUrlAware } from '../app/appSession';
import type { AppSession } from '../../types/appSession';

const reportURL = Config.magasin.urls.client.report.goToReport;
const magasinURL = Config.magasin.urls.client.magasin.goToMagasin;
const analysisURL = Config.magasin.urls.client.analysis.addAnalysis;
const aboutURL = '/about';
const notFoundURL = '/notfound';

type Props = {
  appSession: AppSession
};
const goTo = url => hashHistory.push(url);

const buttonAdd = (t, url) => (
  <Button style={{ fontSize: '3.2em' }} className="button" onClick={() => goTo(url)}>
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
        {buttonAdd(I18n.t('musit.texts.magazine'), magasinURL(props.appSession))}
      </Col>
      <Col>
        {buttonAdd(I18n.t('musit.analysis.analysis'), analysisURL(props.appSession))}
      </Col>
    </Row>

    <Row className="buttonRow">
      <Col md={6}>
        {buttonAdd(I18n.t('musit.reports.reports'), reportURL(props.appSession))}
      </Col>
    </Row>
    <Row>
      <div style={{ height: '300px' }} />
      <div style={{ textAlign: 'center', height: '80px' }}>
        {I18n.t('musit.texts.footerText')}
      </div>
      <div style={{ textAlign: 'center', height: '50px' }}>
        <Col md={4} mdOffset={2}>
          <Button bsStyle="link" onClick={() => goTo(notFoundURL)}>
            {I18n.t('musit.texts.aboutMusitSolutions')}
          </Button>
        </Col>
        <Col md={4}>
          <Button bsStyle="link" onClick={() => goTo(aboutURL)}>
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

export default flowRight([inject(data), makeUrlAware])(HomePage);
