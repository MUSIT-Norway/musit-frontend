import * as React from 'react';
import LatLongComponent from './LatLongComponent';
import MGRSComponent from './MGRSComponent';
import UTMCoordinateComponent from './UTMCoordinateComponent';
import { CoordinateProps } from './CollectingEvents';

const CoordinateHeader = (props: CoordinateProps) => {
  switch (props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType) {
    case 'UTM': {
      return <UTMCoordinateComponent {...props} />;
    }
    case 'MGRS': {
      return <MGRSComponent {...props} />;
    }
    case 'Lat / Long': {
      return <LatLongComponent {...props} />;
    }
    default: {
      return <div />;
    }
  }
};

export default CoordinateHeader;
