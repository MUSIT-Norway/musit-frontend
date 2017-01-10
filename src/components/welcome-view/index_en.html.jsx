import React from 'react';

const NorwegianWelcomePage = (props) => (
  <div>
    <p>MUSIT - Universitetsmuseenes IT-organisasjon</p>
    <br />
    <p>MUSITBasen</p>
    <br />
    <p><a onClick={props.showModal}>Personopplysninger ved bruk av MUSITBasen</a></p>
  </div>
);

export default NorwegianWelcomePage;