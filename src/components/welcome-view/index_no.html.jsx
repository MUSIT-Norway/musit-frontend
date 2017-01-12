import React from 'react';

export default (props) => (
  <div>
    <p>MUSIT - Universitetsmuseenes IT-organisasjon</p>
    <br />
    <p>MUSITbasen</p>
    <br />
    <p>
      <a href="/moreinfo" onClick={props.showModal} className="moreInfo">
        Bruk av personopplysninger i MUSITbasen
      </a>
    </p>
  </div>
);
