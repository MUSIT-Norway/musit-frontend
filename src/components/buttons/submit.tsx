import * as React from 'react';
import { Button } from 'react-bootstrap';
import { TODO } from '../../types/common';

export default (props:TODO) => (
  <Button disabled={props.disabled} bsStyle="primary" onClick={props.onClick}>
    {props.label}
  </Button>
);
