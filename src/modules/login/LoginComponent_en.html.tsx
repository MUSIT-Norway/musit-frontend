import * as React from 'react';
import { TODO } from '../../types/common';

export default (props: TODO) => (
  <div>
    <p>MUSIT - The University museums IT-organisation</p>
    <br />
    <p>MUSITbasen</p>
    <br />
    <p>
      <a href="/moreinfo" onClick={props.showModal} className="moreInfo">
        Use of personal information in MUSITbasen
      </a>
    </p>
  </div>
);
