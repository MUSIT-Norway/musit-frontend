import * as React from 'react';
import { PlaceState, admPlaces, AdmPlace } from './PlaceComponent';

const InputText = (props: {
  value: string;
  label: string;
  readOnly?: boolean;
  onChange?: (v: string) => void;
}) => (
  <div className="col-md-4">
    <label htmlFor={props.label}>{props.label}</label>
    <input
      type="text"
      className="form-control"
      readOnly={props.readOnly}
      onChange={e => {
        if (!props.readOnly) {
          props.onChange && props.onChange(e.target.value);
        }
      }}
      id={props.label}
      value={props.value}
    />
  </div>
);

const AdmPlaceComponent = (
  props: PlaceState & {
    onChange: (value: string) => void;
    onChangeOthers: (field: string) => (value: string) => void;
  }
) => (
  <div>
    <div className="well">
      <div className="row form-group">
        <div className="col-md-12">
          <label htmlFor="admPlaceName">Adm place </label>
          <select
            className="form-control"
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
        <div className="col-md-6">
          <label htmlFor="locality">Lokalitet </label>
          <textarea
            className="form-control"
            id="locality"
            value={props.locality}
            onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChangeOthers('locality')(v.target.value)
            }
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="ecology">Økologi </label>
          <textarea
            className="form-control"
            id="ecology"
            value={props.ecology}
            onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChangeOthers('ecology')(v.target.value)
            }
          />
        </div>
      </div>
    </div>
    <div className="well">
      <div className="row form-group">
        {InputText({
          value: props.station ? props.station : '',
          label: 'Station',
          onChange: v => props.onChangeOthers('station')(v)
        })}
        {InputText({
          value: props.sample ? props.sample : '',
          label: 'Sample',
          onChange: v => props.onChangeOthers('sample')(v)
        })}
        {InputText({
          value: props.ship ? props.ship : '',
          label: 'Ship',
          onChange: v => props.onChangeOthers('ship')(v)
        })}
      </div>
    </div>
  </div>
);

export default AdmPlaceComponent;
