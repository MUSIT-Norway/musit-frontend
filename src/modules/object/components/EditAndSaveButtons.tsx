import * as React from 'react';

export type EditAndSaveButtonProps = {
  onClickSave: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onClickDraft: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onClickEdit: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onClickCancel: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  editButtonState: { visible: boolean; disabled: boolean };
  saveButtonState: { visible: boolean; disabled: boolean };
  cancelButtonState: { visible: boolean; disabled: boolean };
  draftButtonState: { visible: boolean; disabled: boolean };
  saveButtonText: string;
  draftButtonText: string;
  editButtonText: string;
  cancelButtonText: string;
  nameEmpty: boolean;
};

const EditAndSaveButtons = (props: EditAndSaveButtonProps) => {
  return (
    <div className="container-fluid" style={{ padding: '10px', float: 'right' }}>
      <button
        type="button"
        className="btn btn-link"
        onClick={props.onClickCancel}
        disabled={props.cancelButtonState.disabled}
      >
        {props.cancelButtonText}
      </button>{' '}
      {props.editButtonState.visible ? (
        <button
          type="button"
          className="btn btn-default"
          onClick={props.onClickEdit}
          disabled={props.editButtonState.disabled}
        >
          {props.editButtonText}
        </button>
      ) : (
        <span />
      )}{' '}
      {props.draftButtonState.visible && (
        <button
          type="button"
          className="btn btn-warning"
          onClick={props.onClickDraft}
          disabled={props.draftButtonState.disabled}
        >
          {props.draftButtonText}
        </button>
      )}
      <button
        type="button"
        className="btn btn-success"
        onClick={props.onClickSave}
        disabled={props.saveButtonState.disabled || props.nameEmpty}
      >
        {props.saveButtonText}
      </button>
    </div>
  );
};

export default EditAndSaveButtons;
