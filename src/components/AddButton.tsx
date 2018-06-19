// @flow

import * as React from 'react';
import { Button } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
q
type Props = {
  label: string;
};

const AddButton = ({ label, ...props }: Props) => (
  <Button {...props}>
    <FontAwesome name="plus-circle" /> {label}
  </Button>
);

export default AddButton;
