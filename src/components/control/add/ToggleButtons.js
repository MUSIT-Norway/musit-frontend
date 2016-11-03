
import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Button, Row, Col } from 'react-bootstrap';
import './ToggleButtons.css';

export default class ToogleButtons extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool,
    updatevalueOK: PropTypes.func.isRequired,
    updatevalueNotOK: PropTypes.func.isRequired
  }

  render() {
    const { label, value } = this.props;

    return (
      <div className="pageMargin">
        <Row>
          <Col xs={2} />
          <Col xs={10}>
            <label>
              {label}
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            {value != null ?
              <FontAwesome
                name={value ? 'check' : 'times'}
                style={{ padding: '2px', fontSize: 'x-large' }}
              /> :
              null}
          </Col>
          <Col xs={10}>
            <Button
              className={value ? "buttonpaddingtrue" : "buttonpaddingfalse"}
              onClick={this.props.updatevalueOK}
            >
              <FontAwesome name="check" />
              <span>&nbsp;</span>
              OK
            </Button>
            <Button
              className={value != null && !value ? "buttonpaddingtrue" : "buttonpaddingfalse"}
              onClick={this.props.updatevalueNotOK}
            >
              <FontAwesome name="times" />
              <span>&nbsp;</span>
              Ikke OK
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
