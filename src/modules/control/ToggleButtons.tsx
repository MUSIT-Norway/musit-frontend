import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { Button, Row, Col } from 'react-bootstrap';
import './ToggleButtons.css';
import { I18n } from 'react-i18nify';
import { MUSTFIX } from '../../types/common';

interface ToggleButtonsProps {
  label: string;
  value: boolean;
  updatevalueOK: Function;
  updatevalueNotOK: Function;
}

/* Old:
    label: PropTypes.string.isRequired,
    value: PropTypes.bool,
    updatevalueOK: PropTypes.func.isRequired,
    updatevalueNotOK: PropTypes.func.isRequired


*/

export default class ToogleButtons extends React.Component<ToggleButtonsProps> {
  render() {
    const { label, value } = this.props;

    return (
      <div className="pageMargin">
        <Row>
          <Col xs={2} />
          <Col xs={10}>
            <label>{label}</label>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            {value != null ? (
              <FontAwesome
                name={value ? 'check' : 'times'}
                style={{ padding: '2px', fontSize: 'x-large' }}
              />
            ) : null}
          </Col>
          <Col xs={10}>
            <Button
              className={value ? 'buttonpaddingtrue' : 'buttonpaddingfalse'}
              onClick={this.props.updatevalueOK as MUSTFIX}
            >
              <FontAwesome name="check" />
              <span>&nbsp;</span>
              {I18n.t('musit.texts.ok')}
            </Button>
            <Button
              className={
                value != null && !value ? 'buttonpaddingtrue' : 'buttonpaddingfalse'
              }
              onClick={this.props.updatevalueNotOK as MUSTFIX}
            >
              <FontAwesome name="times" />
              <span>&nbsp;</span>
              {I18n.t('musit.texts.notOk')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
