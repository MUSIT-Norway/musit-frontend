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
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import getRoutes from './routes';
import config from './config';
import LanguageJson from '../language.json';
import { I18n } from 'react-i18nify';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';
import appSession$ from './modules/app/appSession';
import pickList$ from './modules/app/pickList';
import provide from 'react-rxjs/dist/RxProvide';
import NotificationSystem from 'react-notification-system';
import notification$ from './shared/errors';
import queryParser from 'query-string';

const notificationSystem = ReactDOM.render(<NotificationSystem />, document.getElementById('errors'));
notification$.subscribe((event) => {
  event = {...event, message: null, body: event.message};
  if (event.level === 'error') {
    event = {...event, autoDismiss: 0};
  }
  notificationSystem.addNotification({
    ...event,
    position: 'tc',
    children: (
      <div style={{margin: '30px'}}>
        <p>
          {event.body}
        </p>
      </div>
    )
  });
});

const accessToken = queryParser.parse(location.search)['_at'];
if (accessToken) {
  const currentSessionStr = localStorage.getItem('appSession');
  const currentSessionObj = JSON.parse(currentSessionStr) || {};
  localStorage.setItem('appSession', JSON.stringify({...currentSessionObj, accessToken }));
  window.location.href='/#/magasin';
} else {
  const dest = document.getElementById('content');

  I18n.loadTranslations(LanguageJson);
  const language = localStorage.getItem('language') || 'no';
  localStorage.setItem('language', language);
  I18n.setLocale(language);

  const appRouter = () => (
    <Router
      onUpdate={() => window.scrollTo(0, 0)}
      history={hashHistory}
    >
      {getRoutes()}
    </Router>
  );

  const SessionProvided = provide({
    appSession$: {
      type: PropTypes.object,
      value: appSession$
    },
    pickList$: {
      type: PropTypes.object,
      value: pickList$
    }
  })(appRouter);

  ReactDOM.render(
    <SessionProvided />,
    dest
  );

  if (config.isDev) {
    window.React = React;
  }
}
