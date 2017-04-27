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
import Logos from '../../components/logos/Logos';
import inject from 'react-rxjs/dist/RxInject';
import FontAwesome from 'react-fontawesome';

export const AboutPage = () => {
  return (
    <Grid>
      <Row>
        <PageHeader>MUSITbasen</PageHeader>
      </Row>
        <Row>
        <form>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" />
              <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </form>
      </Row>



      <Row>
        <Col md={6}>
          <Button bsSize="large">Magasin       &gt;</Button>
        </Col>
        <Col md={6}>
          <Button bsSize="large">Analysis       &gt;</Button>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Button bsSize="large">Repporter       &gt;</Button>
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#e7e7e7', color: 'black' }}>
        <Logos />
      </Row>
     </Grid>
  );
};

export default inject({}, {}, { getLocale: () => I18n._locale })(AboutPage);
