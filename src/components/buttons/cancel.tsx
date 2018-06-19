import * as React from 'react';
import { Button } from 'react-bootstrap';
import { TODO } from '../../types/common';

export default (props:TODO) => <Button onClick={props.onClick}>{props.label}</Button>;
