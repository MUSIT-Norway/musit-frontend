
import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import { hashHistory } from 'react-router'
import { parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../utils'

export default class ObservationControlGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    showMode: PropTypes.oneOf(['ALL', 'CONTROLS', 'OBSERVATIONS', '']),
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      eventType: PropTypes.string.isRequired,
      doneDate: PropTypes.string.isRequired,
      doneBy: PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string
      ]).isRequired,
      registeredDate: PropTypes.string.isRequired,
      registeredBy: PropTypes.string.isRequired
    }))
  }

  constructor (props) {
    super(props)
    this.getIcon = this.getIcon.bind(this)
  }

  getIcon (data, index) {
    const arr = []
    switch (data.eventType) {
      case 'ObservationLightingCondition':
      case 'ControlLightingCondition':
        arr.push(this.icon(data.ok, index, 'musitlightingcondicon'))
        break
      case 'ObservationTemperature':
      case 'ControlTemperature':
        arr.push(this.icon(data.ok, index, 'musittemperatureicon'))
        break
      case 'ObservationHypoxicAir':
      case 'ControlHypoxicAir':
        arr.push(this.icon(data.ok, index, 'musithypoxicairicon'))
        break
      case 'ObservationRelativeHumidity':
      case 'ControlRelativeHumidity':
        arr.push(this.icon(data.ok, index, 'musitrelhumidityicon'))
        break
      case 'ObservationCleaning':
      case 'ControlCleaning':
        arr.push(this.icon(data.ok, index, 'musitcleaningicon'))
        break
      case 'ObservationMold':
      case 'ControlMold':
        arr.push(this.icon(data.ok, index, 'musitmoldicon'))
        break
      case 'ObservationPest':
      case 'ControlPest':
        arr.push(this.icon(data.ok, index, 'musitpesticon'))
        break
      case 'ObservationAlcohol':
      case 'ControlAlcohol':
        arr.push(this.icon(data.ok, index, 'musitalcoholicon'))
        break
      case 'ObservationGas':
      case 'ControlGas':
        arr.push(this.icon(data.ok, index, 'musitgasicon'))
        break
      case 'ObservationWaterDamageAssessment':
      case 'ControlWaterDamageAssessment':
        arr.push(this.icon(data.ok, index, 'musitwaterdamageicon'))
        break
      case 'ObservationFireProtection':
      case 'ControlFireProtection':
        arr.push(this.icon(data.ok, index, 'musitfireprotectionicon'))
        break
      case 'ObservationTheftProtection':
      case 'ControlTheftProtection':
        arr.push(this.icon(data.ok, index, 'musittheftprotectionicon'))
        break
      case 'ObservationPerimeterSecurity':
      case 'ControlPerimeterSecurity':
        arr.push(this.icon(data.ok, index, 'musitperimetersecurityicon'))
        break
      default:
        console.log(`Did not match ${data.eventType}`)
    }
    return arr
  }

  icon (ok, index, name) {
    if (ok) {
      return <span key={index} style={{ color: 'gray', padding: '2px' }} className={`icon icon-${name}`} />
    }
    return <span key={index} style={{ padding: '2px' }} className={`icon icon-${name}`} />
  }

  render () {
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
                const types = c.parts ? c.parts.map(this.getIcon).reduce((f, s) => [...f, ...s]) : null
                return (
                  <tr
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
                      {c.eventType.toLowerCase() === 'control' ? <div className='icon icon-musitcontrolicon' /> : ''}
                      {c.eventType.toLowerCase() === 'observation' ? <div className='icon icon-musitobservationicon' /> : ''}
                    </td>
                    <td id={`${c.id}_${c.doneDate}_date`}>
                      {parseISODate(c.doneDate).format(DATE_FORMAT_DISPLAY)}
                    </td>
                    <td id={`${c.id}_${c.doneDate}_types`}>
                      {types}
                    </td>
                    <td id={`${c.id}_${c.doneDate}_doneBy`}>
                      {c.doneBy.actorId ? c.doneBy.actorId : c.doneBy}
                    </td>
                    <td id={`${c.id}_${c.doneDate}_registeredDate`}>
                      {parseISODate(c.registeredDate).format(DATE_FORMAT_DISPLAY)}
                    </td>
                    <td id={`${c.id}_${c.doneDate}_registeredBy`}>
                      {c.registeredBy}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}
