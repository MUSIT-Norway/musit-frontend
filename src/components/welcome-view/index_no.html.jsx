import React from 'react';

const EnglishWelcomePage = (props) => (
  <div>
    <p>MUSIT - Universitetsmuseenes IT-organisasjon</p>
    <br />
    <p>MUSITbasen</p>
    <br />
    <p>
      <a href="/moreinfo" onClick={props.showModal} className="moreInfo">
        Personopplysninger ved bruk av MUSITbasen
      </a>
    </p>
  </div>
);

export default EnglishWelcomePage;
