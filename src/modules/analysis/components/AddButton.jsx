// @flow

import React from 'react';
import { Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type Props = {
  id: string,
  label: string,
  md: number,
  mdOffset?: number
}

const AddButton = ({id, label, md, mdOffset, ...props}: Props) => (
  <div id={id}>
    <Col md={md} mdOffset={mdOffset}>
      <Button {... props}>
        <FontAwesome name='plus-circle'/>{' '}
        {label}
      </Button>
    </Col>
  </div>
);

AddButton.defaultProps = {
  mdOffset: 0
};

export default AddButton;