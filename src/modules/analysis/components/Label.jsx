/* @flow */

import React from 'react';
import { Col, ControlLabel } from 'react-bootstrap';

type Props = {
  label: string,
  md?: number
}

const LabelFormat = ({ label, md }: Props) => (
  <Col md={md}>
    <ControlLabel>{label}</ControlLabel>
  </Col>
);

LabelFormat.defaultProps = {
  md: 1
};

export default LabelFormat;