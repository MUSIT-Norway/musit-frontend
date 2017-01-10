import React from 'react';
import Logo1 from './assets/UiS_nor_color_rgb.png';
import Logo2 from './assets/UiO_SAMARB_rgb_gjennomsiktig.png';
import Logo3 from './assets/UiT_samarbeidslogo_bokmal_300ppi.png';
import Logo4 from './assets/UiBmerke_grayscale.png';
import Logo5 from './assets/ntnu_u-slagord.png';
import './Logos.css';

export default (props) => (
  <div className="logos" style={props.style}>
    <img style={{ height: '60px' }} alt="logo" src={Logo1} />
    <img style={{ height: '60px' }} alt="logo" src={Logo2} />
    <img style={{ height: '60px' }} alt="logo" src={Logo3} />
    <img style={{ height: '60px' }} alt="logo" src={Logo4} />
    <img style={{ height: '60px' }} alt="logo" src={Logo5} />
  </div>
);