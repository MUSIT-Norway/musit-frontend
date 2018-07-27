import * as React from 'react';
import CoordinateHistoryItemComponent from './CoordinateHistoryItemComponent';
import CoordinateHistoryComponent from './CoordinateHistoryComponent';
import AltitudeDepthData from './AltitudeDepthData';
import CoordinateMetaData from './CoordinateMetaData';
import { CoordinateProps, CoordinateHistory } from './PlaceComponent';

const CoordinateComponent = (
  props: CoordinateProps & { coordinateHistory: CoordinateHistory }
) => {
  return (
    <div>
      <CoordinateMetaData {...props} />
      <AltitudeDepthData {...props} />
      <CoordinateHistoryComponent
        coordinateHistory={props.coordinateHistory}
        onSetEditingIndex={props.onSetEditingIndex}
      />
      <CoordinateHistoryItemComponent {...props} />
    </div>
  );
};

export default CoordinateComponent;
