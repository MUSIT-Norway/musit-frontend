//@flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { ObjectInfo } from '../../../types/conservation';

type Props = {
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  affectedThingsSubEvent?: Array<string>,
  affectedThingsSubEventOnChange?: Function,
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
  affectedThingsWithDetailsMainEvent: Array<ObjectInfo>,
  affectedThingsSubEvent: Array<string>
): Array<string> => {
  if (
    isCheckedAll(affectedThingsWithDetailsMainEvent || [], affectedThingsSubEvent || [])
  )
    return [];
  else return affectedThingsWithDetailsMainEvent.map(o => o.uuid);
};

export default function ObjectSelection({
  affectedThingsWithDetailsMainEvent,
  affectedThingsSubEvent,
  affectedThingsSubEventOnChange,
  viewMode
}: Props) {
  return (
    <div className="col-md-11">
      <table
        style={{
          backgroundColor: 'white'
        }}
        className="table table-striped table-responsive table-hover"
      >
        <caption>
          <h4>
            {viewMode
              ? I18n.t('musit.objects.objectsView.messageToViewObjects')
              : I18n.t('musit.objects.objectsView.messageToSelectObjects')}
          </h4>
        </caption>
        <thead>
          <tr>
            <th>
              {!viewMode && (
                <input
                  className="normalAction"
                  type="checkbox"
                  checked={isCheckedAll(
                    affectedThingsWithDetailsMainEvent || [],
                    affectedThingsSubEvent || []
                  )}
                  disabled={viewMode}
                  onChange={() =>
                    affectedThingsSubEventOnChange &&
                    affectedThingsSubEventOnChange(
                      selectAll(
                        affectedThingsWithDetailsMainEvent || [],
                        affectedThingsSubEvent || []
                      )
                    )
                  }
                />
              )}
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
                !isChecked(row.uuid && row.uuid, affectedThingsSubEvent) &&
                viewMode ? null : (
                  <tr
                    key={['objectRow', i].join('_')}
                    onClick={() =>
                      !viewMode &&
                      toggleSelection &&
                      affectedThingsSubEventOnChange &&
                      affectedThingsSubEventOnChange(
                        toggleSelection(row.uuid || null, affectedThingsSubEvent || [])
                      )
                    }
                  >
                    <td name="type" width={10}>
                      {!viewMode && (
                        <input
                          type="checkbox"
                          value=""
                          checked={isChecked(
                            row.uuid && row.uuid,
                            affectedThingsSubEvent
                          )}
                          disabled={viewMode}
                        />
                      )}
                    </td>
                    <td name="museumNo">{row.museumNo}</td>
                    <td name="subNo">{row.subNo}</td>
                    <td name="term">{row.term}</td>
                  </tr>
                )
              ];
              return rows;
            })
          ) : (
            <span className="no-data">{I18n.t('musit.objects.noData')}</span>
          )}
        </tbody>
      </table>
    </div>
  );
}
