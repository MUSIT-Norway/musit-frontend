import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import './AboutPage.css';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './AboutPage_no.html.jsx';
import EnglishTranslation from './AboutPage_en.html.jsx';
import Logos from '../../components/logos/Logos';

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