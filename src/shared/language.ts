// @flow
import { I18n } from 'react-i18nify';

export const getLanguage = () => localStorage.getItem('language') || 'no';

export const loadLanguage = () => {
  const language = getLanguage();
  localStorage.setItem('language', language);
  I18n.setLocale(language);
};
