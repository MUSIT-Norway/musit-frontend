import * as React from 'react';
//import * as FontAwesome from 'react-fontawesome';
import { CoordinateHistory } from '../placeStateless/PlaceComponent';

const CoordinateHistoryComponent = (props: {
  coordinateHistory: CoordinateHistory;
  onSetEditingIndex: (i: number) => void;
}) => {
  /*   const unitConv = (a?: string, u?: string) => {
    if (a && u) {
      if (u === 'Meters') {
        return a + 'm.';
      } else if (u === 'Feet') {
        return a + 'ft.';
      }
      return '';
    }
    return '';
  }; */

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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinateHistoryComponent;
