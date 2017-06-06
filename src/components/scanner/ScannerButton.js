import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import scannerIconGray from './scannerIconGray.png';
import scannerIconWhite from './scannerIconWhite.png';
import './scannerButton.css';

const ScannerButton = ({ enabled, onClick }) =>
  <Button
    active={enabled}
    className={enabled ? 'scannerEnabled' : 'scannerDisabled'}
    onClick={() => onClick()}
  >
    <img src={enabled ? scannerIconWhite : scannerIconGray} height={25} alt="scan" />
  </Button>;

ScannerButton.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ScannerButton;
