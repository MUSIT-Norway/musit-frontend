import * as React from 'react';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './TermsAndConditions_no.html';
import EnglishTranslation from './TermsAndConditions_en.html';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';

interface TermsAndConditionsProps {
  isVisible: boolean;
  hideModal: boolean;
  locale: () => 'no' | 'en';
}
export const TermsAndConditions = (props: TermsAndConditionsProps) => {
  const Translated = props.locale() === 'no' ? NorwegianTranslation : EnglishTranslation;
  return <Translated {...props} />;
};

export default inject({}, {}, { locale: () => I18n._locale })(TermsAndConditions);
