import React from 'react';
import { Button } from 'react-bootstrap';

export default props => (
  <Button onClick={props.onClick}>
    {props.label}
  </Button>
);
