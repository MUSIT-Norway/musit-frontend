import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { emitSuccess, emitError } from '../../shared/errors/emitter';
import * as loglevel from 'loglevel';
import { I18n } from 'react-i18nify';

export default (ComponentToWrap) => {
  const $ = global.jQuery;

  return class Notifyable extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    }

    static childContextTypes = {
      showModal: PropTypes.func,
      showConfirm: PropTypes.func,
      showError: PropTypes.func,
      showNotification: PropTypes.func,
      logger: PropTypes.object,
      store: PropTypes.object.isRequired
    }

    constructor(props, context) {
      super(props, context);
      this.showModal = this.showModal.bind(this);
    }

    getChildContext() {
      return {
        showModal: this.showModal,
        showConfirm: this.showConfirm,
        showError: emitError,
        showNotification: emitSuccess,
        logger: loglevel,
        store: this.context.store
      };
    }

    showConfirm(message, onYes) {
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
    }


    showModal(title, componentToRender, closeFn) {
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

      const appContext = this.context;

      class ClosableAndProvided extends React.Component {
        static childContextTypes = {
          ...Notifyable.childContextTypes,
          store: React.PropTypes.object,
          closeModal: React.PropTypes.func
        }

        getChildContext() {
          return {
            ...appContext,
            closeModal: () => $dialog.dialog('close')
          };
        }

        render() {
          return componentToRender;
        }
      }

      ReactDOM.render(<ClosableAndProvided />, $dialog[0]);

      $dialog.dialog('open');
    }

    render() {
      return <ComponentToWrap {...this.props} />;
    }
  };
};