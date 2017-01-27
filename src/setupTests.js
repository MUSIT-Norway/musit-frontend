import MuseumId from './models/museumId';

if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./');
}

import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
I18n.loadTranslations(LanguageJson);
I18n.setLocale('no');

import configureMockStore from 'redux-mock-store';
import createMiddleware from './redux/clientMiddleware';
import ApiClient from './redux/ApiClient';
const middlewares = [ createMiddleware(new ApiClient()) ];
global.mockStore = configureMockStore(middlewares);
global.reduxStore = {
  getState: () => ({
    auth: {
      user: {
        museumId: new MuseumId(99)
      }
    }
  })
};