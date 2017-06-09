import React from 'react';
import SampleDetails from '../components/SampleDetails';
import { Button } from 'react-bootstrap';
import '../assets/style.css';

export default ({ history }) => (
  <div>
    <h1>Prøveuttak</h1>
    <hr />
    <div>
      <b>Avledet fra objekter:</b>
      <br />
      <b>Museumsnr:</b> 1234 <b>Unr:</b> 12345678901 <b>Term/Artsnavn:</b> Kniv <a href="#">Se detaljer</a>
    </div>
    <hr />
    <div className="well">
      <p><strong>Felles detaljer for alle prøver</strong></p>
      <SampleDetails />
      <Button
        bsStyle="primary"
        onClick={() => history.push('sample/edit/single')}
      >
        Generer prøver
      </Button>
    </div>
  </div>
);