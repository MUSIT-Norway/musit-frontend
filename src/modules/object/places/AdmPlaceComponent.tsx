import * as React from 'react';
import { PlaceState, admPlaces, AdmPlace } from './PlaceComponent';

const AdmPlaceComponent = (
  props: PlaceState & {
    onChange: (value: string) => void;
    onChangeOthers: (field: string) => (value: string) => void;
  }
) => (
  <div>
    <div className="row form-group">
      <div className="col-md-2">
        <label htmlFor="admPlaceName">Adm place </label>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-5">
        <select
          className="form-control" //
          id="admPlaceName"
          onChange={e => {
            props.onChange(e.target.value);
          }}
        >
          {admPlaces.map((a: AdmPlace) => (
            <option
              key={`optionRow_${a.admPlaceId || 0}`}
              value={a.admPlaceId}
              label={`${a.name || ''} Type: ${a.type || ''} (${
                a.kommune ? a.kommune + ':' : ''
              } ${a.fylke ? a.fylke + ':' : ''} : ${a.land ? a.land : ''})`}
            />
          ))}
        </select>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-2">
        <label htmlFor="locality">Lokalitet </label>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-8">
        <textarea
          rows={6}
          className="form-control"
          id="locality"
          value={props.locality}
          onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
            props.onChangeOthers('locality')(v.target.value)
          }
        />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-2">
        <label htmlFor="ecology">Økologi </label>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-8">
        <textarea
          rows={6}
          className="form-control"
          id="ecology"
          value={props.ecology}
          onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
            props.onChangeOthers('ecology')(v.target.value)
          }
        />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-2">
        <label htmlFor="ecology">Station </label>
      </div>
      <div className="col-md-2">
        <label htmlFor="ecology">Sample </label>
      </div>
      <div className="col-md-2">
        <label htmlFor="ecology">Ship </label>
      </div>
    </div>
    <div className="row form-group">
      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          onChange={e => props.onChangeOthers('station')(e.target.value)}
          id={'txtInputStation'}
          value={props.station ? props.station : ''}
        />
      </div>
      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          onChange={e => props.onChangeOthers('sample')(e.target.value)}
          id={'txtInputSample'}
          value={props.sample ? props.sample : ''}
        />
      </div>
      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          onChange={e => props.onChangeOthers('ship')(e.target.value)}
          id={'txtInputShip'}
          value={props.ship ? props.ship : ''}
        />
      </div>
    </div>
  </div>
);

export default AdmPlaceComponent;
