import * as React from 'react';
import * as moment from 'moment';
import CoordinateComp from './CoordinateComp';
import MapComponent from './MapComponent';
import AdmPlaceComponent from './AdmPlaceComponent';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';

export type AdmPlace = {
  admPlaceId: number;
  name?: string;
  type?: string;
  overordnet?: string;
  kommune?: string;
  fylke?: string;
  land?: string;
  lat?: number;
  long?: number;
  zoom?: number;
};

type Coordinate = {
  coordinateSource?: string;
  coordinateType?: string;
  coordinateGeomertry?: string;
  coordinatePrecision?: number;
  caAltitude?: boolean;
  gpsAccuracy?: number;
  datum?: string;
  utmZone?: number;
  mgrsBand?: string;
  utmNorthSouth?: string;
  coordinateString?: string;
  caCoordinate?: boolean;
  coordinateAddedLater?: boolean;
  coordinateNote?: string;
  altitudeLow?: number;
  altitudeHigh?: number;
  altitudeAggregated?: string;
  altitudeUnit?: string;
  depthLow?: number;
  depthAggregated?: string;
  depthHigh?: number;
  depthUnit?: string;
  caDepth?: boolean;
  isAddedLater?: boolean;
};

export type CoordinateRevisionType =
  | 'newCoordinate'
  | 'coordinateEdit'
  | 'coordinateRevision'
  | 'deleteCoordinate';

export type CoordinateHistoryItem = {
  coordinateId?: number;
  registeredBy?: string;
  registeredDate?: string;
  note?: string;
  coordinate: Coordinate;
  coordinateRevisionType?: CoordinateRevisionType;
};
export type CoordinateHistory = Array<CoordinateHistoryItem>;

export type PlaceState = {
  coordinateHistory: CoordinateHistory;
  editingCoordinate: Coordinate;
  coordinateHistoryIndeks: number;
  editCoorditeMode?: boolean;
  coordinateInvalid: boolean;
  admPlace?: AdmPlace;
  locality?: string;
  ecology?: string;
  station?: string;
  sample?: string;
  ship?: string;
  method?: string;
  methodDescription?: string;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
};

export type PlaceProps = PlaceState & {
  onChangeTextField: (fieldName: string) => (value: string) => void;
  onChangeNumberField: (fieldName: string) => (value: number) => void;
};

export type CoordinateProps = {
  coordinateHistory: CoordinateHistory;
  editingCoordinate: Coordinate;
  editCoordinateMode: boolean;
  coordinateHistoryIndeks: number;
  coordinateCollapsed: boolean;
  coordinateType: string;
  coordinateInvalid: boolean;
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void;
  onSetEditingIndex: (i: number) => void;
  onChangeCoordinateText: (fieldName: string) => (value: string) => void;
  onChangeHistoryItem: (fieldName: string) => (value: string) => void;
  getCurrentCoordinate: (ind: number) => Coordinate;
  getCurrentHistoryItem: (ind: number) => CoordinateHistoryItem;
  onChangeCheckBoxBoolean: (fieldName: string) => (value: string | boolean) => void;
  onClickSaveRevision: () => void;
  onClickSaveEdit: () => void;
  onChangeEditMode: (edit: boolean) => void;
  onToggleCollapse: () => void;
};

export type CheckBoxProps = {
  id: string;
  checked: boolean;
  displayValue: string;
  onChange: string;
};

export const admPlaces: Array<AdmPlace> = [
  {
    admPlaceId: 1,
    name: 'Oslo',
    type: 'Kommune',
    overordnet: 'Oslo fylke',
    kommune: 'Oslo',
    fylke: 'Oslo fylke',
    land: 'Norge',
    lat: 59.8939224,
    long: 10.7149059,
    zoom: 12
  },
  {
    admPlaceId: 2,
    name: 'Bergen',
    type: 'Kommune',
    overordnet: 'Hordaland',
    kommune: 'Bergen',
    fylke: 'Hordaland',
    land: 'Norge',
    lat: 60.3651115,
    long: 5.2887477,
    zoom: 11
  },
  {
    admPlaceId: 3,
    name: 'Trondheim',
    type: 'Kommune',
    overordnet: 'Trøndelag',
    kommune: 'Trondheim',
    fylke: 'Trøndelag',
    land: 'Norge',
    lat: 63.418719,
    long: 10.3685518,
    zoom: 12
  },
  {
    admPlaceId: 4,
    name: 'Kristiansand',
    type: 'Kommune',
    overordnet: 'Aust-Agder',
    kommune: 'Kristiansand',
    fylke: 'Aust-Agder',
    land: 'Norge',
    lat: 58.1529583,
    long: 7.9390013,
    zoom: 12
  },
  {
    admPlaceId: 5,
    name: 'Drammen',
    type: 'Kommune',
    overordnet: 'Buskerud',
    kommune: 'Drammen',
    fylke: 'Buskerud',
    land: 'Norge',
    lat: 59.734017,
    long: 10.1489475,
    zoom: 12
  }
];
export const coordinateTypes = ['MGRS', 'Lat / Long', 'UTM'];
export const datumValues = ['WGS84', 'ED50', 'EUREF-89'];
export const geometryTypes = ['Point', 'Reactangle', 'Polygone', 'Line'];
export const coordinateSources = ['Original label', 'GPS', 'Map', 'Other'];
export const altDepthUnits = ['Meters', 'Feet'];

export default class PlaceComponent extends React.Component<PlaceProps, PlaceState> {
  constructor(props: PlaceProps) {
    super(props);
    this.state = {
      admPlace: admPlaces[0],
      editingCoordinate: {
        coordinateType: 'MGRS',
        altitudeUnit: 'Meters',
        depthUnit: 'Meters',
        caAltitude: false,
        caDepth: false,
        isAddedLater: false,
        caCoordinate: false
      },
      coordinateHistory: [{ coordinate: { coordinateType: 'MGRS' } }],
      coordinateCollapsed: true,
      coordinateHistoryIndeks: 0,
      coordinateInvalid: false
    };
  }

  render() {
    const AdmPlaceRead = (
      <div className="grid">
        <h3>Admplace/Station</h3>
        <div className="row">
          <div className="col-md-4">
            <b>Admplace:</b>{' '}
            {this.state.admPlace
              ? (this.state.admPlace.kommune
                  ? this.state.admPlace.kommune + ' : '
                  : ';') +
                (this.state.admPlace.fylke ? this.state.admPlace.fylke + ' : ' : ';') +
                this.state.admPlace.land
              : ''}
          </div>
          <div className="col-md-4">
            <b>Locality: </b>
            <p>{this.state.locality}</p>
          </div>
          <div className="col-md-4">
            <b>Ecology: </b>
            {this.state.ecology}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <b>Station:</b> {this.state.station}
          </div>
          <div className="col-md-4">
            <b>Sample: </b>
            {this.state.sample}
          </div>
          <div className="col-md-4">
            <b>Ship: </b>
            {this.state.ship}
          </div>
        </div>
      </div>
    );
    const AdmPlaceComp = (
      <AdmPlaceComponent
        {...this.state}
        onChangeOthers={(field: string) => (value: string) => {
          this.setState((ps: PlaceState) => ({
            ...ps,
            [field]: value
          }));
        }}
        onChange={(t: string) => {
          const admPlace = admPlaces.find((a: AdmPlace) => a.admPlaceId === parseInt(t));
          console.log(admPlace);
          this.setState((s: PlaceState) => ({
            ...s,
            admPlace: admPlace,
            kommune: (admPlace && admPlace.kommune) || '',
            fylke: (admPlace && admPlace.fylke) || '',
            land: admPlace && admPlace.land,
            lat: admPlace && admPlace.lat,
            long: admPlace && admPlace.long,
            overordnet: admPlace && admPlace.overordnet,
            type: admPlace && admPlace.type,
            name: admPlace && admPlace.name
          }));
        }}
      />
    );

    const CoordinateComponent = (
      <div>
        <CoordinateComp
          {...this.state.coordinateHistory[this.state.coordinateHistoryIndeks].coordinate}
          editCoordinateMode={this.state.editCoorditeMode || false}
          coordinateHistoryIndeks={this.state.coordinateHistoryIndeks}
          coordinateHistory={this.state.coordinateHistory}
          editingCoordinate={this.state.editingCoordinate}
          coordinateType={
            this.state.coordinateHistory[this.state.coordinateHistoryIndeks].coordinate
              .coordinateType || 'MGRS'
          }
          coordinateInvalid={this.state.coordinateInvalid || false}
          coordinateCollapsed={this.state.coordinateCollapsed || false}
          onChangeCoordinateNumber={(fieldName: string) => (value: number) => {
            this.setState((ps: PlaceState) => {
              return {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  [fieldName]: value
                }
              };
            });
          }}
          onSetEditingIndex={(i: number) => {
            this.setState((ps: PlaceState) => {
              const newEditingCoordinate = ps.coordinateHistory[i];
              return {
                ...ps,
                coordinateHistoryIndeks: i,
                editingCoordinate: newEditingCoordinate.coordinate,
                editCoorditeMode: true
              };
            });
          }}
          onChangeCoordinateText={(fieldName: string) => (value: string) => {
            this.setState((ps: PlaceState) => {
              let coordinateInvalid: boolean = !musitCoodinateValidate(fieldName)(value);
              const s = {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  [fieldName]: value
                },
                coordinateInvalid: coordinateInvalid ? coordinateInvalid : false
              };
              return s;
            });
          }}
          onChangeEditMode={(editMode: boolean) => {
            this.setState((ps: PlaceState) => {
              const s = {
                ...ps,
                editCoorditeMode: editMode
              };

              return s;
            });
          }}
          onChangeCheckBoxBoolean={(fieldName: string) => (value: string) => {
            this.setState((ps: PlaceState) => {
              const s = {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  [fieldName]: value
                }
              };

              return s;
            });
          }}
          getCurrentCoordinate={(ind: number) => {
            const ret = this.state.editingCoordinate;
            return ret;
          }}
          onClickSaveRevision={() => {
            this.setState((ps: PlaceState) => {
              const revType =
                ps.coordinateHistoryIndeks === 0
                  ? 'newCoordinate'
                  : ps.coordinateHistory[ps.coordinateHistoryIndeks]
                      .coordinateRevisionType;
              if (
                ps.editCoorditeMode ||
                (ps.coordinateHistoryIndeks === 0 &&
                  ps.coordinateHistory[ps.coordinateHistoryIndeks]
                    .coordinateRevisionType === undefined)
              ) {
                return {
                  ...ps,
                  editCoorditeMode: false,
                  coordinateHistoryIndeks: ps.coordinateHistory.length - 1,
                  coordinateHistory: [
                    ...ps.coordinateHistory.slice(0, ps.coordinateHistoryIndeks),
                    {
                      ...ps.coordinateHistory[ps.coordinateHistoryIndeks],
                      coordinateRevisionType: revType,
                      coordinate: ps.editingCoordinate
                    },
                    ...ps.coordinateHistory.slice(ps.coordinateHistoryIndeks + 1)
                  ]
                };
              }

              return {
                ...ps,
                coordinateHistoryIndeks: ps.coordinateHistoryIndeks + 1,
                coordinateHistory: [
                  ...ps.coordinateHistory,
                  {
                    coordinate: ps.editingCoordinate,
                    coordinateRevisionType: 'coordinateRevision'
                  }
                ]
              };
            });
          }}
          onClickSaveEdit={() => {
            this.setState((ps: PlaceState) => {
              return {
                ...ps,
                coordinateHistoryIndeks: ps.coordinateHistory[ps.coordinateHistoryIndeks]
                  .coordinateRevisionType
                  ? ps.coordinateHistoryIndeks + 1
                  : ps.coordinateHistoryIndeks,

                coordinateHistory: ps.coordinateHistory[ps.coordinateHistoryIndeks]
                  .coordinateRevisionType
                  ? [
                      ...ps.coordinateHistory,
                      {
                        coordinate: ps.editingCoordinate,
                        coordinateRevisionType: 'coordinateEdit',
                        registeredDate: moment().format('DD.MM.YYYY HH:mm'),
                        registeredBy: 'Stein Olsen'
                      }
                    ]
                  : [
                      ...ps.coordinateHistory,
                      {
                        coordinate: ps.editingCoordinate,
                        coordinateRevisionType: 'newCoordinate'
                      }
                    ]
              };
            });
          }}
          getCurrentHistoryItem={(ind: number) => {
            const ret = this.state.coordinateHistory[ind];
            return ret;
          }}
          onToggleCollapse={() => {
            this.setState((ps: PlaceState) => ({
              ...ps,
              coordinateCollapsed: ps.coordinateCollapsed ? false : true
            }));
          }}
          onChangeHistoryItem={(fieldName: string) => (value: string) => {
            console.log('OnChangeHistItem', fieldName, value);
            this.setState((ps: PlaceState) => {
              return {
                ...ps,
                coordinateHistory: [
                  ...ps.coordinateHistory.slice(0, ps.coordinateHistoryIndeks),
                  {
                    ...ps.coordinateHistory[ps.coordinateHistoryIndeks],
                    [fieldName]: value
                  },
                  ...ps.coordinateHistory.slice(ps.coordinateHistoryIndeks + 1)
                ]
              };
            });
          }}
        />
        <MapComponent {...this.state} />
      </div>
    );
    return (
      <form style={{ padding: '20px' }}>
        <div className="row form-group">
          <div className="col-md-8">
            <CollapseComponent Head={AdmPlaceRead} Body={AdmPlaceComp} />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-md-8">
            <CollapseComponent Head={<div>Hei hei</div>} Body={CoordinateComponent} />
          </div>
        </div>
      </form>
    );
  }
}
