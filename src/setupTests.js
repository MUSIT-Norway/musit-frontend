if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./');
}

import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
I18n.loadTranslations(LanguageJson);
