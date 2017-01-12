import React from 'react';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './moreInfo_no.html.jsx';
import EnglishTranslation from './moreInfo_en.html.jsx';

const getTranslated = (props) => {
  const locale = I18n._locale;
  let Component;
  switch (locale) {
  case 'no':
    Component = NorwegianTranslation;
    break;
  default:
    Component = EnglishTranslation;
  }
  return <Component {...props} />;
};

export default (props) => getTranslated(props);
