import React, { Component, PropTypes } from 'react'
import { Panel, FormGroup, Button, Col, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {
  ObservationFromToNumberCommentComponent // ,
  // ObservationDoubleTextAreaComponent,
  // ObservationStatusPercentageComment,
  // ObservationPest
} from '../../observation'

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
    ControlAlcohol: 'percent',
    ControlCleaning: 'asterisk',
    ControlGas: 'asterisk',
    ControlHypoxicAir: 'asterisk',
    ControlLightingCondition: 'sun-o',
    ControlMold: 'asterisk',
    ControlPest: 'bug',
    ControlRelativeHumidity: 'tint',
    ControlTemperature: 'asterisk'

  }
  static typeMap = {
    ControlAlcohol: 'controlAlcohol',
    ControlCleaning: 'controlCleaning',
    ControlGas: 'controlGas',
    ControlHypoxicAir: 'controlHypoxicAir',
    ControlLightingCondition: 'controlLightingCondition',
    ControlMold: 'controlMold',
    ControlPest: 'controlPest',
    ControlRelativeHumidity: 'controlRelativeHumidity',
    ControlTemperature: 'controlTemperature'
  }

  constructor(props) {
    super(props);
    this.state = {
      ControlAlcohol: {
        open: false
      },
      ControlCleaning: {
        open: false
      },
      ControlGas: {
        open: false
      },
      ControlHypoxicAir: {
        open: false
      },
      ControlLightingCondition: {
        open: false
      },
      ControlMold: {
        open: false
      },
      ControlPest: {
        open: false
      },
      ControlRelativeHumidity: {
        open: false
      },
      ControlTemperature: {
        open: false
      }
    };

    this.showObservation = (control) => {
      let lv = ''
      const { eventType, ok } = control
      if (!ok) {
        switch (eventType) {
          case 'ControlTemperature':
            lv = (<ObservationFromToNumberCommentComponent
              id={"temperature"}
              fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText')}
              fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip')}
              onChangeFrom={(value) => this.onChangeField('temperature', 'fromValue', value)}
              toLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.labelText')}
              toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip')}
              onChangeTo={(value) => this.onChangeField('temperature', 'toValue', value)}
              commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
              commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
              commentPlaceholder={this.props.translate('musit.texts.freetext')}
              onChangeComment={(value) => this.onChangeField('temperature', 'commentValue', value)}
              disabled={Boolean(true)}
              fromValue={control['subEvents-motivates'][0].from.toString()}
              toValue={control['subEvents-motivates'][0].to.toString()}
              commentValue={control['subEvents-motivates'][0].note.toString()}
            />)
            break
          case 'ControlAlcohol':
            lv = ''
            break
          case 'ControlCleaning':
            lv = ''
            break
          case 'ControlGas':
            lv = ''
            break
          case 'ControlHypoxicAir':
            lv = ''
            break
          case 'ControlLightingCondition':
            lv = ''
            break
          case 'ControlMold':
            lv = ''
            break
          case 'ControlPest':
            lv = ''
            break
          case 'ControlRelativeHumidity':
            lv = ''
            break
          default:
            lv = ''
            break
        }
      }
      return lv
    }
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
    const downButton = (observationType, ok) => {
      return (
        <Col xs={2} sm={2} >
          <Button
            id={`${id}_${observationType}_downButton`}
            onClick={() => this.setState({ [observationType]: { open: !this.state[observationType].open } })}
            bsStyle="link"
          >
            {ok ? null : <FontAwesome name="sort-desc" />}
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
            {downButton(eventType, ok)}
          </Row>
          <Row>
            <Panel collapsible expanded={this.state[eventType].open}>
              {this.showObservation(control)}
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
