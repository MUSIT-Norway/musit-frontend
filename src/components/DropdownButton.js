import React from 'react';
import { DropdownButton, MenuItem, FormGroup } from 'react-bootstrap';

type FieldDropDownProps = {
  id: string,
  onChange: Function,
  items: Array<string>,
  title: string
};

export default function({ id, onChange, items, title }: FieldDropDownProps) {
  return (
    <FormGroup controlId={id}>
      <DropdownButton bsStyle="default" title={title} id={id}>
        {items.map((v, i) =>
          <MenuItem key={i} onClick={e => onChange(e.target.text)}>
            {v}
          </MenuItem>
        )}
      </DropdownButton>
    </FormGroup>
  );
}
