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

const client = new ApiClient();
const dest = document.getElementById('content');
const store = createStore(client);
const history = syncHistoryWithStore(hashHistory, store);
import config from './config'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css'
import './index.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap'

import LanguageJson from '../language.json'
import { I18n } from 'react-i18nify'
I18n.loadTranslations(LanguageJson)
I18n.setLocale('no')

import NotificationSystem from 'react-notification-system';

const notificationSystem = ReactDOM.render(<NotificationSystem />, document.getElementById('errors'))

import { source, successSource, emitError } from './errors/emitter'


const children = (message) =>
    <div style={{margin: '30px'}}>
      <p>
        {message}
      </p>
    </div>

successSource.subscribe ((s) => {
  switch(s.type) {
    case 'deleteSuccess':
      notificationSystem.addNotification({
        level: 'success',
        title: I18n.t('musit.notificationMessages.deleting'),
        position: 'tc',
        children: children(s.message)
      });
      break;
    case 'movedSuccess':
      notificationSystem.addNotification({
        level: 'success',
        title: I18n.t('musit.notificationMessages.moving'),
        position: 'tc',
        children: children(s.message)
      });
      break;
    default:
      notificationSystem.addNotification({
        level: 'success',
        children: children(s.message)
      });
  }
});



source.subscribe((e) => {


  switch(e.type) {
    case 'network':
      notificationSystem.addNotification({
        message: e.error.response.req.url,
        level: 'error',
        title: I18n.t('musit.errorMainMessages.networkError'),
        position: 'tc',
        children: children(e.error.response.req.url)
      });
      break;
    case 'dateValidationError':
      notificationSystem.addNotification({
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        position: 'tc',
        children: children(e.message)
      });
      break;
    case 'errorOnDelete':
      notificationSystem.addNotification({
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        position: 'tc',
        children: children(e.message)
      });
      break;
    case 'errorOnMove':
      notificationSystem.addNotification({
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        position: 'tc',
        children: children(e.message)
      });
      break;
    case 'errorOnSave':
      notificationSystem.addNotification({
        level: 'error',
        title: I18n.t('musit.errorMainMessages.applicationError'),
        position: 'tc',
        children: children(e.message)
      });
      break;
    default:
      notificationSystem.addNotification({
        message: 'something happened',
        level: 'error',
        position: 'tc'
      });
  }
});

try {
  const component =
      <Router
        onUpdate={() => window.scrollTo(0, 0)}
        history={history}
      >
        {getRoutes(store)}
      </Router>
    ;

  ReactDOM.render(
    <Provider store={store} key="provider">
      {component}
    </Provider>,
    dest
  );

  if (config.isDev) {
    window.React = React; // enable debugger
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
} catch(e) {
  emitError({ type: 'annet', e })
}


