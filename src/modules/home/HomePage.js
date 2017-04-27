import React from 'react';
import {
  Grid,
  Row,
  Button,
  form,
  FormGroup,
  FormControl,
  InputGroup,
  PageHeader
} from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import Logos from '../../components/logos/Logos';
import inject from 'react-rxjs/dist/RxInject';
import FontAwesome from 'react-fontawesome';
import './index.css';

export const HomePage = () => {
  const buttonAdd = (t) => {
    return (<Row className="buttonRow">
      <Button className="button" >{t} <FontAwesome name="chevron-right" /></Button>
    </Row>);
  };
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
              <InputGroup.Addon><FontAwesome className="buttonIcon" name="search" /></InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </form>
      </Row>

      {buttonAdd('Magasin')}
      {buttonAdd('Analysis')}
      {buttonAdd('Repporter')}

      <Row style={{ backgroundColor: '#e7e7e7', color: 'black' }}>
        <div className="homePage">
          <Logos />
        </div>
      </Row>
    </Grid>
  );
};

export default inject({}, {}, { getLocale: () => I18n._locale })(HomePage);
