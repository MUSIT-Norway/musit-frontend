import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import { hashHistory } from 'react-router'
import { parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../util'
import { I18n } from 'react-i18nify'
import reduce from 'lodash/reduce'
import keys from 'lodash/keys'
import map from 'lodash/map'

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

  getIcon(ok, type, index) {
    switch (type) {
      case 'lightingCondition':
        return this.icon(ok, 'musitlightingcondicon', 'lightCondition')
      case 'temperature':
        return this.icon(ok, 'musittemperatureicon', 'temperature')
      case 'hypoxicAir':
        return this.icon(ok, 'musithypoxicairicon', 'hypoxicAir')
      case 'relativeHumidity':
        return this.icon(ok, 'musitrelhumidityicon', 'relativeHumidity')
      case 'cleaning':
        return this.icon(ok, 'musitcleaningicon', 'cleaning')
      case 'mold':
        return this.icon(ok, 'musitmoldicon', 'mold')
      case 'pest':
        return this.icon(ok, 'musitpesticon', 'pest')
      case 'alcohol':
        return this.icon(ok, 'musitalcoholicon', 'alcohol')
      case 'gas':
        return this.icon(ok, 'musitgasicon', 'gas')
      case 'waterDamageAssessment':
        return this.icon(ok, 'musitwaterdamageicon', 'vannskaderisiko')
      case 'fireProtection':
        return this.icon(ok, 'musitfireprotectionicon', 'brannsikring')
      case 'theftProtection':
        return this.icon(ok, 'musittheftprotectionicon', 'tyverisikring')
      case 'perimeterSecurity':
        return this.icon(ok, 'musitperimetersecurityicon', 'skallsikring')
      default:
    }
  }

  icon(ok, name, tooltip) {
    return <span
      style={ok ? { color: 'gray', padding: '2px' } : { padding: '2px' }}
      className={`icon icon-${name}`}
      title={I18n.t(`musit.observation.page.${tooltip}.labelText`)}
    />
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
                const withIndexAndKey = map(keys({...controlOrObservation}), (type, index) => {
                  return { index, item: controlOrObservation[type], type }
                })
                const icons = reduce(withIndexAndKey, (result, withIndex) => {
                  result.push(this.getIcon(withIndex.item.ok, withIndex.type, withIndex.index))
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
                      {controlOrObservation.eventType.toLowerCase() === 'control' ?
                          <div className="icon icon-musitcontrolicon" title={I18n.t('musit.grid.observation.iconTooltip.control')}/> : ''}
                      {controlOrObservation.eventType.toLowerCase() === 'observation' ?
                          <div className="icon icon-musitobservationicon" title={I18n.t('musit.grid.observation.iconTooltip.observation')}/> : ''}
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
