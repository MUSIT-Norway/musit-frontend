import * as React from 'react';

export const CheckBox = (props: {
  id: string;
  checked: boolean;
  displayValue: string;
  onChange: Function;
  viewMode?: boolean;
}) => (
  <div>
    <label>
      <input
        className="checkBoxComponent"
        type="checkbox"
        id={props.id}
        checked={props.checked}
        disabled={props.viewMode}
        onChange={() => props.onChange()}
      />
      {props.displayValue}
    </label>
  </div>
);
