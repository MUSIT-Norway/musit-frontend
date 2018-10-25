import * as React from 'react';
//import * as FontAwesome from 'react-fontawesome';
import { CoordinateHistory, CoordinateHistoryItem } from './CollectingEvents';

const CoordinateHistoryComponent = (props: {
  coordinateHistory: CoordinateHistory;
  onSetEditingIndex: (i: number) => void;
}) => {
  console.log('anuradha coordinateHistoryComponent : props : ', props.coordinateHistory);
  const unitConv = (a?: string, u?: string) => {
    if (a && u) {
      if (u === 'Meters') {
        return a + 'm.';
      } else if (u === 'Feet') {
        return a + 'ft.';
      }
      return '';
    }
    return '';
  };

  return (
    <div>
      <h3>Coordinate history</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr key="0-key">
              <th>ID</th>
              <th>Rev type</th>
              <th>Coordinate type</th>
              <th>Coordinate</th>
              <th>Altitude</th>
              <th>Depth </th>
              {/* <th>Date</th>
              <th>Reg.by</th>
              <th /> */}
            </tr>
          </thead>
          <tbody>
            <tr />
            {props.coordinateHistory &&
              props.coordinateHistory.map(
                (coordinate: CoordinateHistoryItem, i: number) => {
                  return (
                    <tr key={`${i + 1}-key`}>
                      <td>{coordinate.coordinateId}</td>
                      <td>{coordinate.coordinateRevisionType}</td>
                      <td>{coordinate.coordinate.coordinateType}</td>
                      <td>{coordinate.coordinate.coordinateString}</td>
                      <td>
                        {unitConv(
                          coordinate.coordinate.altitudeAggregated,
                          coordinate.coordinate.altitudeUnit
                        )}
                      </td>
                      <td>
                        {unitConv(
                          coordinate.coordinate.depthAggregated,
                          coordinate.coordinate.depthUnit
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinateHistoryComponent;
