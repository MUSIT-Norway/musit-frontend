import * as React from 'react';
import { PlaceState, AdmPlace } from '../placeStateless/PlaceComponent';
//import { admPlaces } from './mockdata/data';
import AdmplaceSuggest from '../../../components/suggest/AdmPlaceSuggest';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';

const AdmPlaceComponent = (
  props: PlaceState & {
    onChange: (value: AdmPlace) => void;
    onChangeOthers: (field: string) => (value: string) => void;
    appSession: AppSession;
    history: History;
  }
) => {
  const admPlaceAsString = (a: AdmPlace) => {
    return (
      <span className="suggestion-content">
        {a.name ? 'Admplace: ' + a.name + '(' + a.type + ')  Path : ' + a.path : ''}
      </span>
    );
  };

  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="admPlaceName">Adm place </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <AdmplaceSuggest
            id="personNameSuggest"
            disabled={false}
            value={props.admPlace && props.admPlace.name ? props.admPlace.name || '' : ''}
            renderFunc={admPlaceAsString}
            placeHolder="Admplace"
            appSession={props.appSession}
            onChange={props.onChange}
            history={props.history}
          />
        </div>
        {/* <div className="col-md-5">
        <select
          className="form-control" //
          id="admPlaceName"
          onChange={e => {
            e.preventDefault();
            props.onChange(e.target.value);
          }}
        >
          {admPlaces.map((a: AdmPlace) => (
            <option
              key={`optionRow_${a.admPlaceId || 0}`}
              value={a.admPlaceId}
              label={`${a.name || ''} Type: ${a.type || ' : Path : '} (${
                a.kommune ? a.kommune + ':' : ''
              } ${a.fylke ? a.fylke + ':' : ''} : ${a.land ? a.land : ''})`}
            />
          ))}
        </select>
      </div> */}
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="locality">Lokalitet </label>
        </div>
      </div>
      {console.log('############', props.editingInputCoordinate)}
      <div className="row form-group">
        <div className="col-md-8">
          <textarea
            rows={6}
            className="form-control"
            id="locality"
            value={(props.editingAttributes && props.editingAttributes.locality) || ''}
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
            value={props.editingAttributes && props.editingAttributes.ecology}
            onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) => {
              v.preventDefault();
              props.onChangeOthers('ecology')(v.target.value);
            }}
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
            value={props.editingAttributes && props.editingAttributes.station}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            onChange={e => props.onChangeOthers('sample')(e.target.value)}
            id={'txtInputSample'}
            value={props.editingAttributes && props.editingAttributes.sample}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            onChange={e => props.onChangeOthers('ship')(e.target.value)}
            id={'txtInputShip'}
            value={props.editingAttributes && props.editingAttributes.ship}
          />
        </div>
      </div>
    </div>
  );
};

export default AdmPlaceComponent;
