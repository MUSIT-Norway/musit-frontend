import React from 'react';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './TermsAndConditions_no.html.jsx';
import EnglishTranslation from './TermsAndConditions_en.html.jsx';

export default (props) => {
  const Translated = I18n._locale === 'no' ? NorwegianTranslation : EnglishTranslation;
  return <Translated {...props} />;
};
