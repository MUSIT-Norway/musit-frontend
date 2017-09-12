// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type Props = {
  label: string
};

const AddButton = ({ label, ...props }: Props) => (
  <Button {...props}>
    <FontAwesome name="plus-circle" /> {label}
  </Button>
);

export default AddButton;
