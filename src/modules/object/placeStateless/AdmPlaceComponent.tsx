import * as React from 'react';
import { PlaceState, AdmPlace } from '../placeStateless/PlaceComponent';
import AdmplaceSuggest from '../../../components/suggest/AdmPlaceSuggest';
import { AppSession } from 'src/types/appSession';
import { CollectingEventMethod } from '../collectingEvent/CollectingEventStore';
import { History } from 'history';
import { capitalize } from 'lodash';

const AdmPlaceComponent = (
  props: PlaceState & {
    methodId?: number;
    collectingEventMethods: CollectingEventMethod[];
    onChangeMethod: (methodId: string) => void;
    onChange: (value: AdmPlace) => void;
    onChangeOthers: (field: string) => (value: string) => void;
    onSelectCountry: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    getAdmPlaceData: (field: string) => (a: AdmPlace) => string;
    appSession: AppSession;
    history: History;
    readOnly: boolean;
    countries: AdmPlace[];
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
    <div className="container-fluid">
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="admPlaceNameSuggest">
            Country to search within
          </label>
          <div className="col-md-4">
            <select
              className="form-control"
              disabled={props.readOnly}
              placeholder="country to search within"
              id="admPlaceCountries"
              value={props.selectedCountry || localStorage['selectedCountry'] || 'Norway'}
              onChange={props.onSelectCountry}
            >
              <option value="alle"> ---Show all --- </option>
              {props.countries
                .sort(
                  (a, b: AdmPlace) =>
                    a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
                )
                .map((a: AdmPlace, i: number) => (
                  <option key={`countries-${i}`} value={a.name}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="admPlaceNameSuggest">
            Adm place
          </label>
          <div className="col-md-6">
            <AdmplaceSuggest
              id="admPlaceNameSuggest"
              disabled={props.readOnly}
              value={props.admPlace && props.admPlace.name ? props.admPlace.name : ''}
              renderFunc={admPlaceAsString}
              placeHolder="Admplace"
              filter={
                props.selectedCountry || localStorage['selectedCountry'] || 'Norway'
              }
              appSession={props.appSession}
              onChange={props.onChange}
              history={props.history}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="idKommune">
            Selected adm place
          </label>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder={
                props.admPlace && props.admPlace.type === 'Sub region'
                  ? 'Sub Region'
                  : 'Kommune '
              }
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
              placeholder={
                props.admPlace && props.admPlace.type === 'Sub region'
                  ? 'Region'
                  : 'Fylke '
              }
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
              placeholder={
                props.admPlace && props.admPlace.type === 'Sub region'
                  ? 'Country'
                  : 'Land '
              }
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
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="idLocality">
            Locality
          </label>
          <div className="col-md-6">
            <textarea
              rows={4}
              className="form-control"
              id="idLocality"
              disabled={props.readOnly}
              value={(props.editingAttributes && props.editingAttributes.locality) || ''}
              onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeOthers('locality')(v.target.value)
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="idEcology">
            Ecology
          </label>
          <div className="col-md-6">
            <textarea
              rows={4}
              className="form-control"
              id="idEcology"
              disabled={props.readOnly}
              value={(props.editingAttributes && props.editingAttributes.ecology) || ''}
              onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
                props.onChangeOthers('ecology')(v.target.value)
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="idEcology">
            Station/Sample/Ship
          </label>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Station"
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
              placeholder="Sample"
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
              placeholder="Ship"
              disabled={props.readOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onChangeOthers('ship')(e.target.value)
              }
              id={'txtInputShip'}
              value={props.editingAttributes && props.editingAttributes.ship}
            />
          </div>
        </div>
        <div className={`form-group ${props.methodId ? 'has-success' : 'has-warning'}`}>
          {' '}
          <label className="control-label col-md-2" htmlFor="collectingMethod">
            Collecting method
          </label>
          <div className="col-md-3">
            <select
              className="form-control"
              id="collectingMethod"
              placeholder="Method"
              disabled={props.readOnly}
              value={props.methodId}
              onChange={e => {
                props.onChangeMethod(e.target.value);
              }}
            >
              <option value={undefined}>{'Select value'}</option>
              {props.collectingEventMethods ? (
                props.collectingEventMethods.map(
                  (
                    { methodId, method }: { methodId: number; method: string },
                    i: number
                  ) => {
                    const m = capitalize(method);
                    return (
                      <option key={`optionRow_${i}`} value={methodId}>
                        {m}
                      </option>
                    );
                  }
                )
              ) : (
                <option key={`optionRow_${1}`}>{'No data'}</option>
              )}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdmPlaceComponent;
