import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

const AnyReactComponent = (props: {
  text: string;
  lat: number | undefined;
  lng: number | undefined;
}) => (
  <div>
    <FontAwesome name={'map-pin'} />
    <div>{props.lat + ',' + props.lng}</div>
    {props.text}
  </div>
);

export default AnyReactComponent;
