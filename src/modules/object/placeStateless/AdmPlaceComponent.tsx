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
    getAdmPlaceData: (field: string) => (a: AdmPlace) => string;
    appSession: AppSession;
    history: History;
    readOnly: boolean;
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
            disabled={props.readOnly}
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
          <label htmlFor="placeDataDisplay">
            {props.admPlace && props.admPlace.type === 'Sub region'
              ? 'Sub Region'
              : 'Kommune '}{' '}
          </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="placeDataDisplay">
            {props.admPlace && props.admPlace.type === 'Sub region' ? 'Region' : 'Fylke '}{' '}
          </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="placeDataDisplay">
            {props.admPlace && props.admPlace.type === 'Sub region' ? 'Country' : 'Land '}{' '}
          </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id={'txtInputStation'}
            disabled={true}
            value={props.getAdmPlaceData('Kommune')(
              props.admPlace
                ? props.admPlace
                : { admPlaceUuid: '', type: '', path: '', name: '' }
            )}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            disabled={true}
            id={'txtInputStation'}
            value={props.getAdmPlaceData('Fylke')(
              props.admPlace
                ? props.admPlace
                : { admPlaceUuid: '', type: '', path: '', name: '' }
            )}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            disabled={true}
            id={'txtInputStation'}
            value={props.getAdmPlaceData('Land')(
              props.admPlace
                ? props.admPlace
                : { admPlaceUuid: '', type: '', path: '', name: '' }
            )}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="locality">Lokalitet </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <textarea
            rows={4}
            className="form-control"
            id="locality"
            disabled={props.readOnly}
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
        <div className="col-md-6">
          <textarea
            rows={4}
            className="form-control"
            id="ecology"
            disabled={props.readOnly}
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
          <label htmlFor="txtInputStation">Station </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="txtInputSample">Sample </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="txtInputShip">Ship </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            disabled={props.readOnly}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onChangeOthers('station')(e.target.value)
            }
            id={'txtInputStation'}
            value={props.editingAttributes && props.editingAttributes.station}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            disabled={props.readOnly}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onChangeOthers('sample')(e.target.value)
            }
            id={'txtInputSample'}
            value={props.editingAttributes && props.editingAttributes.sample}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            disabled={props.readOnly}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onChangeOthers('ship')(e.target.value)
            }
            id={'txtInputShip'}
            value={props.editingAttributes && props.editingAttributes.ship}
          />
        </div>
      </div>
    </div>
  );
};

export default AdmPlaceComponent;
