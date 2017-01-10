import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import './index.css';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './index_no.html';
import EnglishTranslation from './index_en.html';
import Logos from '../logos/Logos';

const getTranslated = (props) => {
  const locale = I18n._locale;
  switch (locale) {
  case 'no':
    return <NorwegianTranslation {...props} />;
  default:
    return <EnglishTranslation {...props} />;
  }
};

export default (props) => (
  <div>
    <main>
      <Grid>
        <Row className="row-centered">
          <div className="aboutPanel">
            <div>
              {getTranslated(props)}
              <Logos />
            </div>
          </div>
        </Row>
      </Grid>
    </main>
  </div>
);