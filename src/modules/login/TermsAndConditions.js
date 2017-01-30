import React from 'react';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './TermsAndConditions_no.html.jsx';
import EnglishTranslation from './TermsAndConditions_en.html.jsx';
import inject from '../../rxjs/RxInject';

export const TermsAndConditions = (props) => {
  const Translated = props.getLocale() === 'no' ? NorwegianTranslation : EnglishTranslation;
  return <Translated {...props} />;
};

export default inject({}, {}, { getLocale: () => I18n._locale })(TermsAndConditions);