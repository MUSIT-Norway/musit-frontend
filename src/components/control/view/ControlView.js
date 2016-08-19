import React, { Component, PropTypes } from 'react'
import { ControlLabel, Panel, FormGroup, Button, Col, Row } from 'react-bootstrap'
import { MusitField } from '../../formfields'
import FontAwesome from 'react-fontawesome'

export default class ControlView extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    controlsJson: PropTypes.arrayOf(PropTypes.shape({
      eventType: PropTypes.string,
      ok: PropTypes.string.bool
    })),
  }

  static iconMap = {
    ControlTemperature: 'asterisk',
    ControlInertluft: 'asterisk',
    ControlRelativLuftfuktighet: 'tint',
    ControlLysforhold: 'sun-o',
    ControlRenhold: 'asterisk',
    ControlGass: 'asterisk',
    ControlMugg: 'asterisk',
    ControlSkadedyr: 'bug',
    ControlSprit: 'percent'

  }
  static typeMap = {
    ControlTemperature: 'controlTemperature',
    ControlInertluft: 'controlInertluft',
    ControlRelativLuftfuktighet: 'controlRelativLuftfuktighet',
    ControlLysforhold: 'controlLysforhold',
    ControlRenhold: 'controlRenhold',
    ControlGass: 'controlGass',
    ControlMugg: 'controlMugg',
    ControlSkadedyr: 'controlSkadedyr',
    ControlSprit: 'controlSprit'
  }

  constructor(props) {
    super(props);
    this.state = {
      ControlTemperature: {
        open: false
      },
      ControlInertluft: {
        open: false
      },
      ControlRelativLuftfuktighet: {
        open: false
      },
      ControlLysforhold: {
        open: false
      },
      ControlRenhold: {
        open: false
      },
      ControlGass: {
        open: false
      },
      ControlMugg: {
        open: false
      },
      ControlSkadedyr: {
        open: false
      },
      ControlSprit: {
        open: false
      }
    };
  }

  render() {
    const { id } = this.props
    const observation = (fontName, observationType) => {
      return (
        <Col xs={5} sm={5} >
          <FontAwesome name={fontName} />
          {` ${observationType}`}
        </Col>
    ) }
    const controlOk = (
      <Col xs={5} sm={5} >
        <FontAwesome name="check" />
        {`  ${this.props.translate('musit.texts.ok')}`}
      </Col>
    )
    const controlNotOk = (
      <Col xs={5} sm={5} >
        <FontAwesome name="close" />
        {`  ${this.props.translate('musit.texts.notOk')}`}
      </Col>
    )
    const downButton = (observationType) => {
      return (
        <Col xs={2} sm={2} >
          <Button
            id={`${id}_${observationType}_downButton`}
            onClick={() => this.setState({ [observationType]: { open: !this.state[observationType].open } })}
            bsStyle="link"
          >
            <FontAwesome name="sort-desc" />
          </Button>
        </Col>
      ) }
    const oneTableRow = (control, i) => {
      const { eventType, ok } = control
      return (
        <div key={i}>
          <Row>
            {observation(ControlView.iconMap[eventType],
              this.props.translate(`musit.viewControl.${ControlView.typeMap[eventType]}`))}
            {ok ? controlOk : controlNotOk}
            {downButton(eventType)}
          </Row>
          <Row>
            <Panel collapsible expanded={this.state[eventType].open}>
              <Col sm={4} >
                <ControlLabel>label text</ControlLabel>
                <br />
                <MusitField id={`${id}_${eventType}_MusitField`} value="test user" validate="text" />
              </Col>
            </Panel>
          </Row>
        </div>
      ) }

    return (
      <FormGroup>
        {this.props.controlsJson ? this.props.controlsJson.map((c, i) =>
          oneTableRow(c, i)
        ) : null}
      </FormGroup>
    )
  }
}
