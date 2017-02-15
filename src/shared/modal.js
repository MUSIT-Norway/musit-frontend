import React from 'react';
import ReactDOM from 'react-dom';
import { I18n } from 'react-i18nify';

export const showConfirm = (message, onYes) => {
  const title = I18n.t('musit.texts.deleteNode');
  const prompt = `<div>${ message }</div>`;
  const $dialog = $(prompt).dialog({
    autoOpen: false,
    modal: true,
    title: title,
    autoResize: true,
    resizable: false,
    close: function() {
      $( this ).remove();
    }
  });
  $dialog.dialog({
    buttons : [
      {
        text: I18n.t('musit.texts.showConfirm.ok'),
        click: function() {
          onYes();
          $(this).dialog('close');
        }
      },
      {
        text: I18n.t('musit.texts.showConfirm.cancel'),
        click: function() {
          $(this).dialog('close');
        }
      }
    ]
  });
  $dialog.dialog('open');
};


export const showModal = (title, componentToRender, closeFn) => {
  const $dialog = $('<div>').dialog({
    autoOpen: false,
    modal: true,
    title: title,
    autoResize: true,
    minHeight: 'auto',
    resizable: false,
    width: 'auto',
    close: function() {
      ReactDOM.unmountComponentAtNode(this);
      $(this).remove();
      if (typeof closeFn === 'function') {
        closeFn();
      }
    }
  });

  class ClosableAndProvided extends React.Component {
    static childContextTypes = {
      closeModal: React.PropTypes.func
    }

    getChildContext() {
      return {
        closeModal: () => $dialog.dialog('close')
      };
    }

    render() {
      return <div
        style={{
          minHeight: 500,
          minWidth: 700
        }}
      >
        {componentToRender}
      </div>;
    }
  }

  ReactDOM.render(<ClosableAndProvided />, $dialog[0]);

  $dialog.dialog('open');
};