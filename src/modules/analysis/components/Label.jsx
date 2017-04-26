/* @flow */

import React from 'react';
import { Col } from 'react-bootstrap';

type Props = {
  label: string,
  md?: number
}

const LabelFormat = ({ label, md }: Props) => (
  <Col md={md} style={{ textAlign: 'right', padding: '7px' }}>
    <strong>{label}</strong>
  </Col>
);

LabelFormat.defaultProps = {
  md: 1
};

export default LabelFormat;