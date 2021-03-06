import * as React from 'react';
import { Component } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../../shared/util';
import { I18n } from 'react-i18nify';
import { reduce, keys, map } from 'lodash';
import { TODO } from '../../types/common';

interface ObservationControlGridProps {
  id: string;
  showControl: Function;
  showObservation: Function;
  tableData: Array<{
    id: string;
    eventType: string;
    doneDate: string;
    doneBy: number | string;
    registeredDate: string;
    registeredBy: string;
  }>;
}

/* Old:
  static propTypes = {
    id: PropTypes.string.isRequired,
    showControl: PropTypes.func.isRequired,
    showObservation: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        eventType: PropTypes.string.isRequired,
        doneDate: PropTypes.string.isRequired,
        doneBy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        registeredDate: PropTypes.string.isRequired,
        registeredBy: PropTypes.string.isRequired
      })
    )
  };

*/

export default class ObservationControlGrid extends Component<
  ObservationControlGridProps
> {
  constructor(props: ObservationControlGridProps) {
    super(props);
    this.getIcon = this.getIcon.bind(this);
  }

  getIcon(ok: TODO, type: string, index: TODO) {
    switch (type) {
      case 'lightingCondition':
        return this.icon(ok, 'musitlightingcondicon', 'lightCondition', index);
      case 'temperature':
        return this.icon(ok, 'musittemperatureicon', 'temperature', index);
      case 'hypoxicAir':
        return this.icon(ok, 'musithypoxicairicon', 'hypoxicAir', index);
      case 'relativeHumidity':
        return this.icon(ok, 'musitrelhumidityicon', 'relativeHumidity', index);
      case 'cleaning':
        return this.icon(ok, 'musitcleaningicon', 'cleaning', index);
      case 'mold':
        return this.icon(ok, 'musitmoldicon', 'mold', index);
      case 'pest':
        return this.icon(ok, 'musitpesticon', 'pest', index);
      case 'alcohol':
        return this.icon(ok, 'musitalcoholicon', 'alcohol', index);
      case 'gas':
        return this.icon(ok, 'musitgasicon', 'gas', index);
      case 'waterDamageAssessment':
        return this.icon(ok, 'musitwaterdamageicon', 'vannskaderisiko', index);
      case 'fireProtection':
        return this.icon(ok, 'musitfireprotectionicon', 'brannsikring', index);
      case 'theftProtection':
        return this.icon(ok, 'musittheftprotectionicon', 'tyverisikring', index);
      case 'perimeterSecurity':
        return this.icon(ok, 'musitperimetersecurityicon', 'skallsikring', index);
      default:
        return undefined;
    }
  }

  icon(ok: TODO, name: string, tooltip: string, index: TODO) {
    return (
      <span
        key={index}
        style={ok ? { color: 'darkgray', padding: '2px' } : { padding: '2px' }}
        className={`icon icon-${name}`}
        title={I18n.t(`musit.observation.page.${tooltip}.labelText`)}
      />
    );
  }

  render() {
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th />
                <th>{I18n.t('musit.grid.observation.date')}</th>
                <th>{I18n.t('musit.grid.observation.types')}</th>
                <th>{I18n.t('musit.grid.observation.doneBy')}</th>
                <th>{I18n.t('musit.grid.observation.registeredDate')}</th>
                <th>{I18n.t('musit.grid.observation.registeredBy')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.tableData.map((controlOrObservation, i) => {
                const withIndexAndKey = map(
                  keys({ ...controlOrObservation }),
                  (type, index) => {
                    return { index, item: controlOrObservation[type], type };
                  }
                );
                const icons = reduce(
                  withIndexAndKey,
                  (result: TODO[], withIndex) => {
                    if (withIndex.item) {
                      result.push(
                        this.getIcon(withIndex.item.ok, withIndex.type, withIndex.index)
                      );
                    }
                    return result;
                  },
                  []
                );
                return (
                  <tr
                    style={{ cursor: 'pointer' }}
                    key={i}
                    id={`${controlOrObservation.id}_${controlOrObservation.doneDate}`}
                    onClick={() => {
                      if (controlOrObservation.eventType.toLowerCase() === 'control') {
                        this.props.showControl(controlOrObservation);
                      } else {
                        this.props.showObservation(controlOrObservation);
                      }
                    }}
                  >
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_type`}
                    >
                      {controlOrObservation.eventType.toLowerCase() === 'control' ? (
                        <div
                          className="icon icon-musitcontrolicon"
                          title={I18n.t('musit.grid.observation.iconTooltip.control')}
                        />
                      ) : (
                        ''
                      )}
                      {controlOrObservation.eventType.toLowerCase() === 'observation' ? (
                        <div
                          className="icon icon-musitobservationicon"
                          title={I18n.t('musit.grid.observation.iconTooltip.observation')}
                        />
                      ) : (
                        ''
                      )}
                    </td>
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_date`}
                    >
                      {parseISODate(controlOrObservation.doneDate).format(
                        DATE_FORMAT_DISPLAY
                      )}
                    </td>
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_types`}
                    >
                      {icons}
                    </td>
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_doneBy`}
                    >
                      {controlOrObservation.doneBy}
                    </td>
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_registeredDate`}
                    >
                      {parseISODate(controlOrObservation.registeredDate).format(
                        DATE_FORMAT_DISPLAY
                      )}
                    </td>
                    <td
                      id={`${controlOrObservation.id}_${
                        controlOrObservation.doneDate
                      }_registeredBy`}
                    >
                      {controlOrObservation.registeredBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    );
  }
}
