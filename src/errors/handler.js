import React from 'react';
import NotificationSystem from 'react-notification-system';
import { source, successSource } from './emitter';
import { I18n } from 'react-i18nify';
import ReactDOM from 'react-dom';

const notificationSystem = ReactDOM.render(<NotificationSystem />, document.getElementById('errors'));

const children = (message) =>
  <div style={{margin: '30px'}}>
    <p>
      {message}
    </p>
  </div>;

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
  case 'saveSuccess':
    notificationSystem.addNotification({
      level: 'success',
      title: I18n.t('musit.notificationMessages.saving'),
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
    const { response } = e.error;
    const { req } = response || {};
    const msg = req ? req.url : e.error.message;
    notificationSystem.addNotification({
      message: msg,
      level: 'error',
      title: I18n.t('musit.errorMainMessages.networkError'),
      position: 'tc',
      children: children(msg)
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
      message: e.error.message,
      level: 'error',
      position: 'tc'
    });
  }
});