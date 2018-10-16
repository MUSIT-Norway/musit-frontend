﻿import * as React from 'react';
import PlaceComponent from './PlaceComponent';

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
gpsAccuracy?: number;
datum?: string;
utmZone?: number;
mgrsBand?: string;
utmNorthSouth?: string;
coordinateString?: string;
caAltitude?: boolean;
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
type CoordinateRevisionType =
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
admPlace?: AdmPlace;
locality?: string;
ecology?: string;
station?: string;
sample?: string;
ship?: string;
coordinateHistory: CoordinateHistory;
editingCoordinate: Coordinate;
coordinateHistoryIndeks: number;
editCoorditeMode?: boolean;
coordinateInvalid: boolean; 
method?: string;
methodDescription?: string;
coordinateCollapsed?: boolean;
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
onChangeAltitudeString: (value: string) => void;
onChangeDepthString: (value: string) => void;
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
    },
    {
    admPlaceId: 6,
    name: 'Buskerud',
    type: 'Fylke',
    overordnet: 'Norge',
    fylke: 'Buskerud',
    land: 'Norge',
    lat: 60,
    long: 9,
    zoom: 12
    }
    ];


export default class CollectionEventsComponent extends React.Component<PlaceProps, PlaceState> {
     constructor(props: PlaceProps) {
    super(props);
    this.state = {
      admPlace: admPlaces[0],
      editingCoordinate: {
        coordinateType: 'MGRS',
        altitudeUnit: 'Meters',
        depthUnit: 'Meters',
        datum: 'WGS84',
        caAltitude: false,
        caDepth: false,
        isAddedLater: false
      },
      coordinateHistory: [{ coordinate: { coordinateType: '' } }],
      coordinateCollapsed: true,
      coordinateHistoryIndeks: 0,
      coordinateInvalid: false
    };
  }

  render() {
    console.log('Place state on load ', this.state);
   
    const pageBodyComp = (
      <div>
        <PlaceComponent
          {...this.state}
          onChangeOthers={(field: string) => (value: string) => {
            this.setState((ps: PlaceState) => ({
              ...ps,
              [field]: value
            }));
          }}
          onChange={(t: string) => {
            const admPlace = admPlaces.find(
              (a: AdmPlace) => a.admPlaceId === parseInt(t)
            );
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
          // Cordinate Props

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
          onChangeAltitudeString={(value: string) => {
            const A = value.match(/\d+/g);
            console.log('A', A);
            const altFrom = A ? parseFloat(A[0]) : undefined;
            const altTo = A ? parseFloat(A[1]) : undefined;
            const altUnit = value.match(/^\d+(\s*\-\s*\d+)?\s*(ft|ft\.|f\.|feet|foot)$/i)
              ? 'Feet'
              : 'Meters';

            this.setState((ps: PlaceState) => ({
              ...ps,
              editingCoordinate: {
                ...ps.editingCoordinate,
                altitudeAggregated: value,
                altitudeLow: altFrom,
                altitudeHigh: altTo,
                altitudeUnit: altUnit
              }
            }));
          }}
          onChangeDepthString={(value: string) => {
            const A = value.match(/\d+/g);
            const depthFrom = A ? parseFloat(A[0]) : undefined;
            const depthTo = A ? parseFloat(A[1]) : undefined;
            const depthUnit = value.match(
              /^\d+(\s*\-\s*\d+)?\s*(ft|ft\.|f\.|feet|foot)$/i
            )
              ? 'Feet'
              : 'Meters';

            this.setState((ps: PlaceState) => ({
              ...ps,
              editingCoordinate: {
                ...ps.editingCoordinate,
                depthAggregated: value,
                depthLow: depthFrom,
                depthHigh: depthTo,
                depthUnit: depthUnit
              }
            }));
          }}
          onChangeCoordinateText={(fieldName: string) => (value: string) => {
            this.setState((ps: PlaceState) => {
              let coordinateInvalid: boolean = !musitCoodinateValidate(fieldName)(value);
              const utmNorthSouth =
                (value === 'UTM' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingCoordinate.coordinateType === 'UTM')
                  ? ps.editingCoordinate.utmNorthSouth
                  : undefined;

              const mgrsBand =
                (value === 'MGRS' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingCoordinate.coordinateType === 'MGRS')
                  ? ps.editingCoordinate.mgrsBand
                  : undefined;

              const utmZone =
                ((value === 'MGRS' || value === 'UTM') &&
                  fieldName === 'coordinateType') ||
                ((fieldName !== 'coordinateType' &&
                  ps.editingCoordinate.coordinateType === 'MGRS') ||
                  ps.editingCoordinate.coordinateType === 'UTM')
                  ? ps.editingCoordinate.utmZone
                  : undefined;

              const coordinateGeomertry =
                (value === 'Lat / Long' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingCoordinate.coordinateType === 'Lat / Long')
                  ? ps.editingCoordinate.coordinateGeomertry
                  : undefined;

              return {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  utmNorthSouth,
                  mgrsBand,
                  utmZone,
                  coordinateGeomertry,
                  [fieldName]: value
                },
                coordinateInvalid: coordinateInvalid ? coordinateInvalid : false
              };
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
      </div>
    );

    const headerRead = () => (
      <div>
        <h3>Place</h3>
      </div>
    );

    return (
      <div className="container-fluid">
        <form style={{ padding: '20px' }}>
          <div className="row form-group">
            <div className="col-md-8">
              <div className="row">
                <CollapseComponent Head={headerRead()} Body={pageBodyComp} />
              </div>
            </div>
            <div className="col-md-4">
    
            </div>
          </div>
        </form>
      </div>
    );
  }
}