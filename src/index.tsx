import 'es6-shim';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import MusitRoutes from './routes';
import config from './config';
import { LanguageJson } from './language';
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
import provide from './indexHelp';
import * as NotificationSystem from 'react-notification-system';
import notification$ from './shared/errors';
import * as queryParser from 'query-string';
import { loadLanguage } from './shared/language';
import Config from './config';
import { TODO } from './types/common';

// let LanguageJson  = require('./language.json');
//let {provide} = require('react-rxjs/dist/RxProvide');

const notificationSystem = ReactDOM.render(<NotificationSystem />, document.getElementById('errors')) as any; //TODO!
notification$.subscribe((origEvent) => {
	let event: any = { ...origEvent, message: null, body: (origEvent as TODO).message };
	if (event.level === 'error') {
		event = { ...event, autoDismiss: 0 };
	}
	if (event.level === 'warning') {
		event = { ...event, autoDismiss: 2 };
	}
	notificationSystem.addNotification({
		...event,
		position: 'tc',
		children: (
			<div style={{ margin: '30px' }}>
				<p>{event.body}</p>
			</div>
		)
	});
});

const accessToken = queryParser.parse(window.location.search)['_at'];
if (accessToken) {
	localStorage.setItem('accessToken', JSON.stringify({ accessToken }));
	window.location.href = Config.magasin.urls.client.aboutPage;
} else {
	const dest = document.getElementById('content');

	I18n.setTranslations(LanguageJson);
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
		window['React'] = React;
	}
}
