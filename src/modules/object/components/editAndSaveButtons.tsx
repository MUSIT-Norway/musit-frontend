import * as React from 'react';

export type EditAndSaveButtonProps = {
  onClickSave: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onClickEdit: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onClickCancel: ((e: React.MouseEvent<HTMLButtonElement>) => void);
  editButtonState: { visible: boolean; disabled: boolean };
  saveButtonState: { visible: boolean; disabled: boolean };
  cancelButtonState: { visible: boolean; disabled: boolean };
  saveButtonText: string;
  editButtonText: string;
  cancelButtonText: string;
};

export const EditAndSaveButtons = (props: EditAndSaveButtonProps) => {
  return (
    <div className="row">
      <div className="col-md-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.onClickSave}
          disabled={props.saveButtonState.disabled}
        >
          {props.saveButtonText}
        </button>
      </div>
      <div className="col-md-2">
        <button
          type="button"
          className="btn btn-default"
          onClick={props.onClickEdit}
          disabled={props.editButtonState.disabled}
        >
          {props.editButtonText}
        </button>
      </div>
      <div className="col-md-2">
        <button
          type="button"
          className="btn btn-link"
          onClick={props.onClickCancel}
          disabled={props.cancelButtonState.disabled}
        >
          {props.cancelButtonText}
        </button>
      </div>
    </div>
  );
};
