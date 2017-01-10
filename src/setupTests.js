import MuseumId from './models/museumId';
import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
import configureMockStore from 'redux-mock-store';
import createMiddleware from './redux/clientMiddleware';
import ApiClient from './redux/ApiClient';

if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./');
}

I18n.loadTranslations(LanguageJson);
I18n.setLocale('no');

const middlewares = [ createMiddleware(new ApiClient()) ];
global.mockStore = configureMockStore(middlewares);
global.reduxStore = mockStore({
  app: {
    user: {
      museumId: new MuseumId(99)
    }
  }
});