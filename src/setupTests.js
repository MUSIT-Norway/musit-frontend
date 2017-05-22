import LanguageJson from './language.json';
import { I18n } from 'react-i18nify';

if (!global.localStorage) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./');
}

I18n.loadTranslations(LanguageJson);
I18n.setLocale('no');
