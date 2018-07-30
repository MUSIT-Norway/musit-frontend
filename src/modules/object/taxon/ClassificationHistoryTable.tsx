import * as React from 'react';
import { IClassifications } from './TaxonClassification';

export const ClassificationHistoryTable = (props: IClassifications) => {
  console.log(props);
  return (
    <div>
      <table className="table table-condensed table-hover">
        <thead>
          <tr key="event-heading">
            <th>Event type</th>
            <th>Event date</th>
            <th>Person name (Det)</th>
            <th>Event data</th>
          </tr>
        </thead>
        <tbody>
          {props.classifications && props.classifications.length >= 0 ? (
            props.classifications
              .filter(t => t.getEventType && t.getEventType() === 'Taxon')
              .map((t, i) => (
                <tr key={'eventrow-' + (i + 1)}>
                  <td>{t.getEventType && t.getEventType()}</td>
                  <td>{t.getDate && t.getDate()}</td>
                  <td>{t.getPersonData && t.getPersonData()}</td>
                  <td>{t.getEventData && t.getEventData()}</td>
                </tr>
              ))
          ) : (
            <div />
          )}
        </tbody>
      </table>
    </div>
  );
};
