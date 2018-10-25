import * as React from 'react';
import CoordinateHistoryItemComponent from './CoordinateHistoryItemComponent';
import CoordinateHistoryComponent from './CoordinateHistoryComponent';
import AltitudeDepthData from './AltitudeDepthData';
import CoordinateMetaData from './CoordinateMetaData';
import { CoordinateProps, CoordinateHistory } from './CollectingEvents';

const CoordinateComponent = (
  props: CoordinateProps & { coordinateHistory: CoordinateHistory }
) => {
  return (
    <div className="form-group">
      <CoordinateMetaData {...props} />
      <AltitudeDepthData {...props} />
      <CoordinateHistoryItemComponent {...props} />
      <CoordinateHistoryComponent
        coordinateHistory={props.coordinateHistory}
        onSetEditingIndex={props.onSetEditingIndex}
      />
    </div>
  );
};

export default CoordinateComponent;
