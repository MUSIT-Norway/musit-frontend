import React from 'react';
import { I18n } from 'react-i18nify';

type Props = {
  saveOnClick?: ?Function,
  saveDisabled?: ?boolean,
  cancelOnClick?: ?Function,
  cancelDisabled?: ?boolean,
  deleteOnClick?: ?Function,
  deleteDisabled?: ?boolean,
  deleteHide?: ?boolean,
  editOnClick?: ?Function,
  editDisabled?: ?boolean
};
export default function Toolbar({
  saveOnClick,
  saveDisabled,
  cancelOnClick,
  cancelDisabled,
  deleteOnClick,
  deleteDisabled,
  deleteHide,
  editOnClick,
  editDisabled
}: Props) {
  return (
    <div className="col-md-11" style={{ marginBottom: 20 }}>
      {!deleteHide && (
        <button
          key="btn-delete"
          className="btn btn-primary"
          disabled={deleteDisabled}
          onClick={deleteOnClick}
          style={{ marginRight: 55 }}
        >
          {I18n.t('musit.texts.delete')}
        </button>
      )}

      <button
        key="btn-edit"
        className="btn btn-primary"
        disabled={editDisabled}
        onClick={editOnClick}
        style={{ marginLeft: -15 }}
      >
        {I18n.t('musit.texts.edit')}
      </button>

      <div style={{ float: 'right' }}>
        <button
          key="btn-cancel"
          className="btn-link"
          style={{ marginRight: 40 }}
          onClick={cancelOnClick}
          disabled={cancelDisabled}
        >
          {I18n.t('musit.texts.cancel')}
        </button>
        <button
          key="btn-save"
          className="btn btn-primary"
          disabled={saveDisabled}
          onClick={saveOnClick}
        >
          {I18n.t('musit.texts.save')}
        </button>
      </div>
    </div>
  );
}
