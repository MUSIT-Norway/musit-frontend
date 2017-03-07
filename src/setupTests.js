if (!global.localStorage) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./');
}

import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
I18n.loadTranslations(LanguageJson);
I18n.setLocale('no');
