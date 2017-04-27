/* @flow */

import React from 'react';
import { Col, FormControl } from 'react-bootstrap';
import Label from './Label';

type Props = {
  id: string,
  label: string,
  md?: number
}

const FieldGroup = ({id, label, md, ...props}: Props) => (
  <div id={id}>
    <Label label={label} md={md} />
    <Col md={2}>
      <FormControl {... props} />
    </Col>
  </div>
);

FieldGroup.defaultProps = {
  md: 1
};

export default FieldGroup;