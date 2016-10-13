import reduce from 'lodash/reduce'
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

  constructor(props) {
    super(props)
    this.getIcon = this.getIcon.bind(this)
  }

  getIcon(ok, type) {
    switch (type) {
      case 'lightingCondition':
        return this.icon(ok, 'musitlightingcondicon')
      case 'temperature':
        return this.icon(ok, 'musittemperatureicon')
      case 'hypoxicAir':
        return this.icon(ok, 'musithypoxicairicon')
      case 'relativeHumidity':
        return this.icon(ok, 'musitrelhumidityicon')
      case 'cleaning':
        return this.icon(ok, 'musitcleaningicon')
      case 'mold':
        return this.icon(ok, 'musitmoldicon')
      case 'pest':
        return this.icon(ok, 'musitpesticon')
      case 'alcohol':
        return this.icon(ok, 'musitalcoholicon')
      case 'gas':
        return this.icon(ok, 'musitgasicon')
      case 'waterDamageAssessment':
        return this.icon(ok, 'musitwaterdamageicon')
      case 'fireProtection':
        return this.icon(ok, 'musitfireprotectionicon')
      case 'theftProtection':
        return this.icon(ok, 'musittheftprotectionicon')
      case 'perimeterSecurity':
        return this.icon(ok, 'musitperimetersecurityicon')
      default:
    }
  }

  icon(ok, name) {
    if (!ok) {
      return <span style={{ color: 'gray', padding: '2px' }} className={`icon icon-${name}`} />
    }
    return <span style={{ padding: '2px' }} className={`icon icon-${name}`} />
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
              {this.props.tableData.map((controlOrObservation, i) => {
                const icons = reduce(controlOrObservation, (result, value, key) => {
                  result.push(this.getIcon(value.ok, key))
                  return result;
                }, [])
                return (
                  <tr
                    style={{ cursor: 'pointer' }}
                    key={i}
                    id={`${controlOrObservation.id}_${controlOrObservation.doneDate}`}
                    onClick={() => {
                      if (controlOrObservation.eventType.toLowerCase() === 'control') {
                        hashHistory.push(`magasin/${this.props.id}/control/${controlOrObservation.id}`)
                      } else {
                        hashHistory.push(`magasin/${this.props.id}/observation/${controlOrObservation.id}`)
                      }
                    }}
                  >
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_type`}>
                      {controlOrObservation.eventType.toLowerCase() === 'control' ? <div className="icon icon-musitcontrolicon" /> : ''}
                      {controlOrObservation.eventType.toLowerCase() === 'observation' ? <div className="icon icon-musitobservationicon" /> : ''}
                    </td>
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_date`}>
                      {parseISODate(controlOrObservation.doneDate).format(DATE_FORMAT_DISPLAY)}
                    </td>
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_types`}>
                      {icons}
                    </td>
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_doneBy`}>
                      {controlOrObservation.doneBy}
                    </td>
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_registeredDate`}>
                      {parseISODate(controlOrObservation.registeredDate).format(DATE_FORMAT_DISPLAY)}
                    </td>
                    <td id={`${controlOrObservation.id}_${controlOrObservation.doneDate}_registeredBy`}>
                      {controlOrObservation.registeredBy}
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
