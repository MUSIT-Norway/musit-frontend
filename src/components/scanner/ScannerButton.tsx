import * as React from 'react';
import { Button } from 'react-bootstrap';
import scannerIconGray from './scannerIconGray.png';
import scannerIconWhite from './scannerIconWhite.png';
import './scannerButton.css';


type ScannerButtonProps = {
  enabled: boolean // bool.isRequired,
  onClick: Function // func.isRequired
};
/*#OLD
ScannerButton.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

*/
const ScannerButton:React.SFC<ScannerButtonProps> = ({ enabled, onClick }) => (
  <Button
    active={enabled}
    className={enabled ? 'scannerEnabled' : 'scannerDisabled'}
    onClick={() => onClick()}
  >
    <img src={enabled ? scannerIconWhite : scannerIconGray} height={25} alt="scan" />
  </Button>
);


export default ScannerButton;
