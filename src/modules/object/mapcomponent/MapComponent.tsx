import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import AnyReactComponent from './AnyReactComponent';

type MapProps = {
  coord?: {
    lat: number;
    lng: number;
  };
  coordinateString?: string;
  style?: {
    height: string;
    width: string;
  };
};

const getLatLong = (props: MapProps): { lat: number; lng: number } => {
  const latLong = props.coord;

  return latLong && latLong.lat && latLong.lng
    ? latLong
    : {
        lat: 0,
        lng: 0
      };
};

const MapComponent = (props: MapProps) => (
  <div className="well" style={{ ...props.style }}>
    <div style={{ height: '100%', width: '100%' }}>
      {getLatLong(props) &&
      !(getLatLong(props).lat === 0 && getLatLong(props).lng === 0) ? (
        <GoogleMapReact
          key={
            props.coordinateString
              ? props.coordinateString
              : props.coord
                ? props.coord.lat.toString() + ',' + props.coord.lng.toString()
                : '0,0'
          }
          // TODO change to ENV.KEY variable and change key too
          bootstrapURLKeys={{ key: 'AIzaSyD_eIPYgmzLr_FsDLVf47fJ2mOP5wvPnG4' }}
          defaultCenter={getLatLong(props)}
          defaultZoom={getLatLong(props) ? 8 : 0}
        >
          <AnyReactComponent
            lat={getLatLong(props).lat}
            lng={getLatLong(props).lng}
            text={'Test Object info.'}
          />
        </GoogleMapReact>
      ) : (
        'Invalid LatLng!'
      )}
    </div>
  </div>
);

export default MapComponent;
