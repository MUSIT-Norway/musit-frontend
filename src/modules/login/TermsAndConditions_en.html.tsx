import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { TODO } from '../../types/common';

export default (props: TODO) => (
  <Modal show={props.isVisible} onHide={props.hideModal}>
    <Modal.Header closeButton>
      <Modal.Title>Use of personal information in MUSITbasen</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>MUSITbasen uses Dataporten to authenticate users at login.</p>
      <br />
      <p>In MUSITbasen the following personal information is stored:</p>
      <ul>
        <li>User name, full name and email address at your university.</li>
        <li>
          Information about which access a user has, and the changes made in the system by
          the user.
        </li>
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.hideModal}>Close</Button>
    </Modal.Footer>
  </Modal>
);
