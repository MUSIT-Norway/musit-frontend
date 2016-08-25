

import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { hashHistory } from 'react-router'

export default class ObservationControlGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
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
  static iconMap = {
    temperature: 'asterisk',
    inertAir: 'cloud',
    relativeHumidity: 'tint',
    cleaning: 'fa',
    lightCondition: 'sun-o',
    alchohol: 'percent',
    gas: 'inr',
    mold: 'bolt',
    pest: 'bug',
    envdata: 'truck'
  }

  render() {
    const { id, translate } = this.props
    const showEnabledIcon = (data, type) => {
      return (
        (data) ? <FontAwesome style={{ padding: '2px' }} name={ObservationControlGrid.iconMap[type]} /> : ''
      )
    }
    const showDisabledIcon = (data, type) => {
      return (
        (data === false) ?
          <FontAwesome style={{ color: 'gray', padding: '2px' }} name={ObservationControlGrid.iconMap[type]} /> : ''
      )
    }
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th />
                <th>
                  {translate('musit.grid.observation.date')}
                </th>
                <th>
                  {translate('musit.grid.observation.types')}
                </th>
                <th>
                  {translate('musit.grid.observation.doneBy')}
                </th>
                <th>
                  {translate('musit.grid.observation.registeredDate')}
                </th>
                <th>
                  {translate('musit.grid.observation.registeredBy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.tableData.map((c, i) =>
                <tr
                  key={i}
                  id={`${c.id}_${c.doneDate}`}
                  onClick={() =>
                    (hashHistory.push(c.type === 'control' ?
                    `magasin/${id}/control/${c.id}` : `magasin/${id}/observation/${c.id}`
                  ))}
                >
                  <td id={`${c.id}_${c.doneDate}_type`}>
                    {c.type && c.type.toLowerCase() === 'control' ? <FontAwesome name="user-secret" /> : ''}
                    {c.type && c.type.toLowerCase() === 'observation' ? <FontAwesome name="eye" /> : ''}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_date`}>
                    {`${c.doneDate}`}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_types`}>
                    {showEnabledIcon(c.types.ControlTemperature, 'temperature')}
                    {showDisabledIcon(c.types.ControlTemperature, 'temperature')}
                    {showEnabledIcon(c.types.ControlHypoxicAir, 'inertAir')}
                    {showDisabledIcon(c.types.ControlHypoxicAir, 'inertAir')}
                    {showEnabledIcon(c.types.ControlRelativeHumidity, 'relativeHumidity')}
                    {showDisabledIcon(c.types.ControlRelativeHumidity, 'relativeHumidity')}
                    {showEnabledIcon(c.types.ControlCleaning, 'cleaning')}
                    {showDisabledIcon(c.types.ControlCleaning, 'cleaning')}
                    {showEnabledIcon(c.types.ControlLightingCondition, 'lightCondition')}
                    {showDisabledIcon(c.types.ControlLightingCondition, 'lightCondition')}
                    {showEnabledIcon(c.types.ControlAlcohol, 'alchohol')}
                    {showDisabledIcon(c.types.ControlAlcohol, 'alchohol')}
                    {showEnabledIcon(c.types.ControlGas, 'gas')}
                    {showDisabledIcon(c.types.ControlGas, 'gas')}
                    {showEnabledIcon(c.types.ControlMold, 'mold')}
                    {showDisabledIcon(c.types.ControlMold, 'mold')}
                    {showEnabledIcon(c.types.ControlPest, 'pest')}
                    {showDisabledIcon(c.types.ControlPest, 'pest')}
                    {showEnabledIcon(c.types.envdata, 'envdata')}
                    {showDisabledIcon(c.types.envdata, 'envdata')}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_doneBy`}>
                    {`${c.doneBy}`}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_registeredDate`}>
                    {`${c.registeredDate}`}
                  </td>
                  <td id={`${c.id}_${c.doneDate}_registeredBy`}>
                    {`${c.registeredBy}`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}
