import React from 'react';
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
import inject from 'react-rxjs/dist/RxInject';
import FontAwesome from 'react-fontawesome';
import './index.css';

export const HomePage = () => {
  const buttonAdd = t => {
    return (
      <Button style={{ fontSize: '3.2em' }} className="button">
        {t} <FontAwesome name="chevron-right" />
      </Button>
    );
  };

  return (
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
          {buttonAdd(I18n.t('musit.texts.magazine'))}
        </Col>
        <Col>
          {buttonAdd(I18n.t('musit.analysis.analysis'))}
        </Col>
      </Row>

      <Row className="buttonRow">
        <Col md={6}>
          {buttonAdd(I18n.t('musit.reports.reports'))}
        </Col>
      </Row>
    </Grid>
  );
};

export default inject({}, {}, { getLocale: () => I18n._locale })(HomePage);
