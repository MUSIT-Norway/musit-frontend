import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default (props) => (
  <Modal show={props.isVisible} onHide={props.hideModal}>
    <Modal.Header closeButton>
      <Modal.Title>Bruk av personopplysninger i MUSITbasen</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>MUSITbasen benytter Dataporten til autentisering av brukere ved pålogging.</p>
      <br />
      <p>I MUSITbasen lagres følgende personopplysninger:</p>
      <ul>
        <li>Brukernavn, fullt navn og epostadresse ved ditt universitet.</li>
        <li>Informasjon om hvilke tilganger en bruker har og hvilke endringer som er gjort i systemet av brukeren.</li>
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.hideModal}>
        Lukk
      </Button>
    </Modal.Footer>
  </Modal>
);
