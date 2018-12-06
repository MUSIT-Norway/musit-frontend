import * as React from 'react';
import LatLongComponent from './LatLongComponent';
import MGRSComponent from './MGRSComponent';
import UTMCoordinateComponent from './UTMCoordinateComponent';
import { CoordinateProps } from '../placeStateless/PlaceComponent';

const CoordinateHeader = (props: CoordinateProps) => {
  switch (props.editingInputCoordinate && props.editingInputCoordinate.coordinateType) {
    case 'UTM': {
      return <UTMCoordinateComponent {...props} />;
    }
    case 'MGRS': {
      return <MGRSComponent {...props} />;
    }
    case 'LAT/LONG': {
      return <LatLongComponent {...props} />;
    }
    default: {
      return <div />;
    }
  }
};

export default CoordinateHeader;
