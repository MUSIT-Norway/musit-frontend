/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import 'es6-shim';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/configureStore.js';
import ApiClient from './middleware/ApiClient';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import getRoutes from './routes';
import DevTools from './components/dev-tools';
import config from './config';
import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
import * as loglevel from 'loglevel';
import './errors/handler';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';
import './state/codeReceiver';

const client = new ApiClient();
const dest = document.getElementById('content');
const store = createStore(client);

// ---- Global Store -----
// This is crucial for the parts of the app that are not in redux!
global.reduxStore = store;
// ---- Global Store -----

const history = syncHistoryWithStore(hashHistory, store);

I18n.loadTranslations(LanguageJson);
const language = localStorage.getItem('language') || 'no';
localStorage.setItem('language', language);
I18n.setLocale(language);

if (config.isDev) {
  loglevel.setLevel('debug');
} else {
  loglevel.setLevel('error');
}

const component =
  <Router
    onUpdate={() => window.scrollTo(0, 0)}
    history={history}
  >
    {getRoutes(store)}
  </Router>;

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (config.isDev) {
  window.React = React;
}

if (config.useDevTools && !window.devToolsExtension) {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}

