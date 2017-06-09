import 'es6-shim';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import MusitRoutes from './routes';
import config from './config';
import LanguageJson from './language.json';
import { I18n } from 'react-i18nify';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';
import './styles/autosuggest.css';
import './styles/index.css';
import './styles/table.css';
import './styles/fonts.css';
import appSession$ from './stores/appSession';
import pickList$ from './stores/pickList';
import predefined$ from './stores/predefined';
import provide from 'react-rxjs/dist/RxProvide';
import NotificationSystem from 'react-notification-system';
import notification$ from './shared/errors';
import queryParser from 'query-string';
import { loadLanguage } from './shared/language';

const notificationSystem = ReactDOM.render(
  <NotificationSystem />,
  document.getElementById('errors')
);
notification$.subscribe(event => {
  event = { ...event, message: null, body: event.message };
  if (event.level === 'error') {
    event = { ...event, autoDismiss: 0 };
  }
  notificationSystem.addNotification({
    ...event,
    position: 'tc',
    children: (
      <div style={{ margin: '30px' }}>
        <p>
          {event.body}
        </p>
      </div>
    )
  });
});

const accessToken = queryParser.parse(window.location.search)['_at'];
if (accessToken) {
  localStorage.setItem('accessToken', JSON.stringify({ accessToken }));
  window.location.href = '/#/home';
} else {
  const dest = document.getElementById('content');

  I18n.loadTranslations(LanguageJson);
  loadLanguage();

  const SessionProvided = provide({
    appSession$: {
      type: PropTypes.object,
      value: appSession$
    },
    pickList$: {
      type: PropTypes.object,
      value: pickList$
    },
    predefined$: {
      type: PropTypes.object,
      value: predefined$
    }
  })(MusitRoutes);

  ReactDOM.render(<SessionProvided />, dest);

  if (config.isDev) {
    window.React = React;
  }
}
