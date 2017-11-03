//@flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { ObjectInfo } from '../../../types/conservation';

type Props = {
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  affectedThingsSubEvent?: Array<string>,
  updateForm?: Function,
  viewMode?: ?boolean
};

const isChecked = (uuid, affectedThingsSubEvent): boolean =>
  uuid &&
  affectedThingsSubEvent &&
  affectedThingsSubEvent.filter(e => e === uuid).length > 0
    ? true
    : false;

const isCheckedAll = (
  affectedThingsWithDetailsMainEvent: Array<ObjectInfo>,
  affectedThingsSubEvent: Array<string>
): boolean =>
  affectedThingsWithDetailsMainEvent &&
  affectedThingsSubEvent &&
  affectedThingsWithDetailsMainEvent.filter(e => !affectedThingsSubEvent.includes(e.uuid))
    .length === 0
    ? true
    : false;

const toggleSelection = (uuid, affectedThingsSubEvent): Array<string> => {
  if (uuid && affectedThingsSubEvent && affectedThingsSubEvent.includes(uuid))
    return affectedThingsSubEvent.filter(f => f !== uuid);
  else if (uuid && affectedThingsSubEvent && !affectedThingsSubEvent.includes(uuid))
    return affectedThingsSubEvent.concat(uuid);
  else return affectedThingsSubEvent || [];
};

const selectAll = (
  affectedThingsWithDetailsMainEvent: Array<ObjectInfo>
): Array<string> => {
  if (affectedThingsWithDetailsMainEvent)
    return affectedThingsWithDetailsMainEvent.map(o => o.uuid);
  else return [];
};

export default function ObjectSelection({
  affectedThingsWithDetailsMainEvent,
  affectedThingsSubEvent,
  updateForm,
  viewMode
}: Props) {
  return (
    <div className="form-group">
      <div className="col-md-12 col-md-offset-0">
        <div>
          <label>{I18n.t('musit.objects.objectsView.messageToSelectObjects')}</label>
        </div>
        <table
          style={{
            backgroundColor: 'white'
          }}
          className="table table-striped table-responsive table-hover"
        >
          <thead>
            <tr>
              <th>
                <input
                  className="normalAction"
                  type="checkbox"
                  checked={isCheckedAll(
                    affectedThingsWithDetailsMainEvent || [],
                    affectedThingsSubEvent || []
                  )}
                  disabled={viewMode}
                  onChange={() =>
                    updateForm &&
                    updateForm(selectAll(affectedThingsWithDetailsMainEvent || []))}
                />
              </th>
              <th>{I18n.t('musit.objects.objectsView.musNo')}</th>
              <th>{I18n.t('musit.objects.objectsView.subNo')}</th>
              <th>{I18n.t('musit.objects.objectsView.term')}</th>
            </tr>
          </thead>
          <tbody>
            {affectedThingsWithDetailsMainEvent ? (
              affectedThingsWithDetailsMainEvent.map((row: any, i: number) => {
                const rows = [
                  <tr
                    key={['objectRow', i].join('_')}
                    onClick={() =>
                      !viewMode &&
                      toggleSelection &&
                      updateForm &&
                      updateForm(
                        toggleSelection(row.uuid || null, affectedThingsSubEvent || [])
                      )}
                  >
                    <td name="type" width={10}>
                      <input
                        type="checkbox"
                        value=""
                        checked={isChecked(row.uuid && row.uuid, affectedThingsSubEvent)}
                        disabled={viewMode}
                      />
                    </td>
                    <td name="museumNo">{row.museumNo}</td>
                    <td name="subNo">{row.subNo}</td>
                    <td name="term">{row.term}</td>
                  </tr>
                ];
                return rows;
              })
            ) : (
              <span className="no-data">{I18n.t('musit.objects.noData')}</span>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
