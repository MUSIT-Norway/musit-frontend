import React from 'react';
import { Button } from 'react-bootstrap';

export default props => (
  <Button disabled={props.disabled} bsStyle="primary" onClick={props.onClick}>
    {props.label}
  </Button>
);
