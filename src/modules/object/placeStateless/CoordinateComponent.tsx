import * as React from 'react';
import CoordinateHistoryItemComponent from './CoordinateHistoryItemComponent';
import AltitudeDepthData from './AltitudeDepthData';
import CoordinateMetaData from './CoordinateMetaData';
import { CoordinateProps } from '../placeStateless/PlaceComponent';

const CoordinateComponent = (
  props: CoordinateProps //& { coordinateHistory: CoordinateHistory }
) => {
  return (
    <div className="form-group">
      <CoordinateMetaData {...props} />
      <AltitudeDepthData {...props} />
      <CoordinateHistoryItemComponent {...props} />
    </div>
  );
};

export default CoordinateComponent;
