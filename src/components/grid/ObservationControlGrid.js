

import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import { hashHistory } from 'react-router'
import { parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../util'

export default class ObservationControlGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    showMode: PropTypes.oneOf(['ALL', 'CONTROLS', 'OBSERVATIONS', '']),
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      doneDate: PropTypes.string.isRequired,
      types: PropTypes.object.isRequired,
      doneBy: PropTypes.string.isRequired,
      registeredDate: PropTypes.string.isRequired,
      registeredBy: PropTypes.string.isRequired
    }))
  }

  static icon(ok, name) {
    if (ok) {
      return <div style={{ padding: '2px' }} className={`icon icon-${name}`} />
    }
    return <div style={{ color: 'gray', padding: '2px' }} className={`icon icon-${name}`} />
  }

  static getIcon(data) {
    const arr = []
    switch (data.eventType) {
      case 'ObservationLightingCondition':
      case 'ControlLightingCondition':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitlightingcondicon'))
        break;
      case 'ObservationTemperature':
      case 'ControlTemperature':
        arr.push(ObservationControlGrid.icon(data.ok, 'musittemperatureicon'))
        break;
      case 'ObservationHypoxicAir':
      case 'ControlHypoxicAir':
        arr.push(ObservationControlGrid.icon(data.ok, 'musithypoxicairicon'))
        break;
      case 'ObservationRelativeHumidity':
      case 'ControlRelativeHumidity':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitrelhumidityicon'))
        break;
      case 'ObservationCleaning':
      case 'ControlCleaning':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitcleaningicon'))
        break;
      case 'ObservationMold':
      case 'ControlMold':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitmoldicon'))
        break;
      case 'ObservationPest':
      case 'ControlPest':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitpesticon'))
        break;
      case 'ObservationAlcohol':
      case 'ControlAlcohol':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitalcoholicon'))
        break;
      case 'ObservationGas':
      case 'ControlGas':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitgasicon'))
        break;
      case 'ObservationWaterDamageAssessment':
      case 'ControlWaterDamageAssessment':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitwaterdamageicon'))
        break;
      case 'ObservationFireProtection':
      case 'ControlFireProtection':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitfireprotectionicon'))
        break;
      case 'ObservationTheftProtection':
      case 'ControlTheftProtection':
        arr.push(ObservationControlGrid.icon(data.ok, 'musittheftprotectionicon'))
        break;
      case 'ObservationPerimeterSecurity':
      case 'ControlPerimeterSecurity':
        arr.push(ObservationControlGrid.icon(data.ok, 'musitperimetersecurityicon'))
        break;
      default:
    }
    return arr;
  }

  render() {
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th />
                <th>
                  {this.props.translate('musit.grid.observation.date')}
                </th>
                <th>
                  {this.props.translate('musit.grid.observation.types')}
                </th>
                <th>
                  {this.props.translate('musit.grid.observation.doneBy')}
                </th>
                <th>
                  {this.props.translate('musit.grid.observation.registeredDate')}
                </th>
                <th>
                  {this.props.translate('musit.grid.observation.registeredBy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.tableData.map((c, i) => {
                const types = c['subEvents-parts'].map(ObservationControlGrid.getIcon).reduce((f, s) => [...f, ...s])
                return (<tr
                  style={{ cursor: 'pointer' }}
                  key={i}
                  id={`${c.id}_${c.doneDate}`}
                  onClick={() => {
                    if (c.eventType.toLowerCase() === 'control') {
                      hashHistory.push(`magasin/${this.props.id}/control/${c.id}`)
                    } else {
                      hashHistory.push(`magasin/${this.props.id}/observation/${c.id}`)
                    }
                  }}
                >
                  <td id={`${c.id}_${c.doneDate}_type`}>
                    {c.eventType.toLowerCase() === 'control' ? <div className="icon icon-musitcontrolicon" /> : ''}
                    {c.eventType.toLowerCase() === 'observation' ? <div className="icon icon-musitobservationicon" /> : ''}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_date`}>
                    {parseISODate(c.doneDate).format(DATE_FORMAT_DISPLAY)}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_types`}>
                    {types}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_doneBy`}>
                    {c.doneBy}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_registeredDate`}>
                    {parseISODate(c.registeredDate).format(DATE_FORMAT_DISPLAY)}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_registeredBy`}>
                    {c.registeredBy}
                  </td>
                </tr>
                ) })}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}
