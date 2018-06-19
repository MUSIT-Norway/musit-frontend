//@flow
import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

type FieldDropDownProps = {
  id: string,
  onChange: Function,
  items: Array<string>,
  displayItems: ?Array<string>,
  title: string
};

export default function({
  id,
  onChange,
  items,
  displayItems,
  title
}: FieldDropDownProps) {
  return (
    <DropdownButton bsStyle="default" title={title} id={id}>
      {items.map((v, i) => (
        <MenuItem key={i} onClick={e => onChange(v)}>
          {(displayItems && displayItems[i]) || v}
        </MenuItem>
      ))}
    </DropdownButton>
  );
}
