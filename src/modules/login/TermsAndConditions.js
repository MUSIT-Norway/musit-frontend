import React from 'react';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './TermsAndConditions_no.html.jsx';
import EnglishTranslation from './TermsAndConditions_en.html.jsx';
import { RxInjectLegacy as inject } from 'react-rxjs';

export const TermsAndConditions = props => {
  const Translated = props.locale() === 'no' ? NorwegianTranslation : EnglishTranslation;
  return <Translated {...props} />;
};

export default inject({}, {}, { locale: () => I18n._locale })(TermsAndConditions);
