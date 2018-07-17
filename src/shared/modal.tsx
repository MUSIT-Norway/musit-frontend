import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import { I18n } from 'react-i18nify';
import { TODO } from '../types/common';

let __$dialog__: TODO;

type REMOVEJQUERY = TODO;

export const closeModal = () => {
  if (__$dialog__ && typeof __$dialog__.close === 'function') {
    __$dialog__.close();
  }
};

export const showConfirm = (message: TODO, onYes: TODO) => {
  closeModal();

  const title = I18n.t('musit.texts.delete');
  const prompt = `<div>${message}</div>`;
  const $dialog = (__$dialog__ = (global as REMOVEJQUERY).$(prompt).dialog({
    autoOpen: false,
    modal: true,
    title: title,
    autoResize: true,
    resizable: false,
    close: function() {
      (global as REMOVEJQUERY).$(this).remove();
    }
  }));
  $dialog.dialog({
    buttons: [
      {
        text: I18n.t('musit.texts.showConfirm.ok'),
        click: function() {
          onYes();
          (global as REMOVEJQUERY).$(this).dialog('close');
        }
      },
      {
        text: I18n.t('musit.texts.showConfirm.cancel'),
        click: function() {
          (global as REMOVEJQUERY).$(this).dialog('close');
        }
      }
    ]
  });
  $dialog.dialog('open');
};

export const showModal = (title: TODO, componentToRender: TODO, closeFn?: TODO) => {
  closeModal();

  const $dialog = (__$dialog__ = (global as REMOVEJQUERY).$('<div>').dialog({
    autoOpen: false,
    modal: true,
    title: title,
    autoResize: true,
    // minHeight: 'auto',
    overflowY: 'hidden',
    resizable: true,
    width: 'auto',
    close: function() {
      ReactDOM.unmountComponentAtNode(this);
      (global as REMOVEJQUERY).$(this).remove();
      if (typeof closeFn === 'function') {
        closeFn();
      }
    }
  }));

  class ClosableAndProvided extends React.Component {
    static childContextTypes = {
      closeModal: PropTypes.func
    };

    getChildContext() {
      return {
        closeModal: () => $dialog.dialog('close')
      };
    }

    render() {
      return (
        <div
          style={{
            minHeight: 500,
            maxHeight: 500,
            minWidth: 700
          }}
        >
          {componentToRender}
        </div>
      );
    }
  }

  ReactDOM.render(<ClosableAndProvided />, $dialog[0]);

  $dialog.dialog('open');
};
