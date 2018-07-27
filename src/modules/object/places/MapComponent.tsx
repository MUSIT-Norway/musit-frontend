import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import AnyReactComponent from './AnyReactComponent';
import { PlaceState } from './PlaceComponent';

const getLatLong = (props: PlaceState): { lat: number; lng: number } => {
  const latLong =
    props.editingCoordinate &&
    props.editingCoordinate.coordinateType &&
    props.editingCoordinate.coordinateType === 'Lat/Long' &&
    props.editingCoordinate.coordinateString
      ? {
          lat: Number(props.editingCoordinate.coordinateString.split(' ')[0]),
          lng: Number(props.editingCoordinate.coordinateString.split(' ')[1])
        }
      : {
          lat: props.admPlace && props.admPlace.lat ? props.admPlace.lat : 0,
          lng: props.admPlace && props.admPlace.long ? props.admPlace.long : 0
        };

  return latLong && latLong.lat && latLong.lng
    ? latLong
    : {
        lat: 0,
        lng: 0
      };
};

const MapComponent = (props: PlaceState) => (
  <div className="well">
    <div style={{ height: '40vh', width: '100%' }}>
      {getLatLong(props) &&
      !(getLatLong(props).lat === 0 && getLatLong(props).lng === 0) ? (
        <GoogleMapReact
          key={
            props.editingCoordinate &&
            props.editingCoordinate.coordinateType &&
            props.editingCoordinate.coordinateType === 'Lat/Long' &&
            props.editingCoordinate.coordinateString
              ? props.editingCoordinate.coordinateString
              : props.admPlace && props.admPlace.lat && props.admPlace.long
                ? props.admPlace.lat + props.admPlace.long
                : '0,0'
          }
          // TODO change to ENV.KEY variable and change key too
          bootstrapURLKeys={{ key: 'AIzaSyD_eIPYgmzLr_FsDLVf47fJ2mOP5wvPnG4' }}
          defaultCenter={getLatLong(props)}
          defaultZoom={
            getLatLong(props)
              ? 8
              : props.admPlace && props.admPlace.zoom
                ? props.admPlace.zoom
                : 3
          }
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
