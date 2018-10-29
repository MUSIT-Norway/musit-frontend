import * as React from 'react';
import * as moment from 'moment';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';
import { admPlaces } from '../placeStateless/mockdata/data';
import { Collection, SynonymType, ExternalId } from '../person/PersonComponent';
import EventMetadata from './EventMetadata';
import { formatISOString } from '../../../shared/util';
import PlaceComponent, { AdmPlace, PlaceState } from '../placeStateless/PlaceComponent';
import { CollectingEventStoreState } from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import {} from '../../../stores/appSession';

export type CollectingEventProps = CollectingEventState & {
  onChangeTextField: (fieldName: string) => (value: string) => void;
  onChangeNumberField: (fieldName: string) => (value: number) => void;
};

export type EventMetadataProps = CollectingEventState & {
  onChangeEventMetaData: (fieldName: string) => (value: string) => void;
  onClearBornDate: Function;
  onChangeBornDate: Function;
  onClearDeathDate: Function;
  onChangeDeathDate: Function;
  onChangeVerbatimDate: (newDate: string) => void;
};

export type Person = {
  collections?: Collection[];
  firstName?: string;
  lastName?: string;
  name: string;
  personAttribute?: PersonAttribute;
  personUuid: PersonUuid;
  synonyms?: SynonymType[];
  title?: string;
};

export type PersonAttribute = {
  bornDate?: string;
  deathDate?: string;
  displayName?: string;
  externalIds?: ExternalId[];
  legalEntityType: string;
  url?: string;
  verbatimDate?: string;
};

export type Uuid = string;
export type EventUuid = Uuid;
export type RoleId = number;
export type PersonUuid = Uuid;
export type PersonNameUuid = Uuid;

export type ActorsAndRelation = {
  actorUuid: Uuid;
  relation: RoleId;
};

export type Event = {
  eventUuid: EventUuid;
  eventType: number;
  museumId?: number;
  collectionId?: number;
  note?: string;
  partOf?: EventUuid;
  createdBy?: Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
};

export interface CollectingEventState {
  placeState: PlaceState;
  eventState: Event;
  person: Person;
}

export class CollectingEventState implements CollectingEventState {
  placeState: PlaceState;
  eventState: Event;
  person: Person;

  constructor(placeState: PlaceState, eventState: Event, person: Person) {
    this.placeState = placeState;
    this.eventState = eventState;
    this.person = person;
  }
}

export type CollectingProps = {
  addCollectingEvent?: Function;
  store: CollectingEventStoreState;
  appSession: AppSession;
  history: History;
};

export default (props: CollectingProps) => (
  <CollectingEvents
    appSession={props.appSession}
    store={props.store}
    addCollectingEvent={
      props.addCollectingEvent && props.addCollectingEvent(props.appSession)
    }
    history={props.history}
  />
);

export class CollectingEvents extends React.Component<
  CollectingProps,
  CollectingEventState
> {
  constructor(props: CollectingProps) {
    super(props);
    console.log('COLLECTING EVENT STORE', props.store);
    this.state =
      props.store && props.store.localState
        ? props.store.localState
        : {
            placeState: {
              admPlace: admPlaces[0],
              editingCoordinate: {
                coordinateType: 'MGRS',
                altitudeUnit: 'Meters',
                depthUnit: 'Meters',
                datum: 'WGS84',
                caAltitude: false,
                caDepth: false,
                isAddedLater: false,
                caCoordinate: false
              },
              coordinateHistory: [{ coordinate: { coordinateType: '' } }],
              coordinateCollapsed: true,
              coordinateHistoryIndeks: 0,
              coordinateInvalid: false
            },
            eventState: {
              eventUuid: '',
              eventType: 12
            },
            person: {
              personUuid: '',
              name: ''
            }
          };
  }

  componentWillReceiveProps(props: CollectingProps) {
    console.log('Recieve props: ====>', props);
    if (props.store.localState) {
      this.setState(() => ({ ...props.store.localState }));
    }
  }
  render() {
    console.log('CollectionEventState on load ', this.state);

    const PlaceBodyComponent = (
      <div>
        <PlaceComponent
          {...this.state}
          onChangeOthers={(field: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  [field]: value
                }
              };
            });
          }}
          onChange={(t: string) => {
            const admPlace = admPlaces.find(
              (a: AdmPlace) => a.admPlaceId === parseInt(t)
            );
            console.log(admPlace);
            this.setState((s: CollectingEventState) => ({
              ...s,
              placeState: {
                ...s.placeState,
                admPlace: admPlace,
                kommune: (admPlace && admPlace.kommune) || '',
                fylke: (admPlace && admPlace.fylke) || '',
                land: admPlace && admPlace.land,
                lat: admPlace && admPlace.lat,
                long: admPlace && admPlace.long,
                overordnet: admPlace && admPlace.overordnet,
                type: admPlace && admPlace.type,
                name: admPlace && admPlace.name
              }
            }));
          }}
          // Cordinate Props

          {...this.state.placeState.coordinateHistory[
            this.state.placeState.coordinateHistoryIndeks
          ].coordinate}
          editCoordinateMode={this.state.placeState.editCoorditeMode || false}
          coordinateHistoryIndeks={this.state.placeState.coordinateHistoryIndeks}
          coordinateHistory={this.state.placeState.coordinateHistory}
          editingCoordinate={this.state.placeState.editingCoordinate}
          coordinateType={
            this.state.placeState.coordinateHistory[
              this.state.placeState.coordinateHistoryIndeks
            ].coordinate.coordinateType || 'MGRS'
          }
          coordinateInvalid={this.state.placeState.coordinateInvalid || false}
          coordinateCollapsed={this.state.placeState.coordinateCollapsed || false}
          onChangeCoordinateNumber={(fieldName: string) => (value: number) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  editingCoordinate: {
                    ...cs.placeState.editingCoordinate,
                    [fieldName]: value
                  }
                }
              };
            });
          }}
          onSetEditingIndex={(i: number) => {
            this.setState((cs: CollectingEventState) => {
              const newEditingCoordinate = cs.placeState.coordinateHistory[i];
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  coordinateHistoryIndeks: i,
                  editingCoordinate: newEditingCoordinate.coordinate,
                  editCoorditeMode: true
                }
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

            this.setState((cs: CollectingEventState) => ({
              ...cs,
              placeState: {
                ...cs.placeState,
                editingCoordinate: {
                  ...cs.placeState.editingCoordinate,
                  altitudeAggregated: value,
                  altitudeLow: altFrom,
                  altitudeHigh: altTo,
                  altitudeUnit: altUnit
                }
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

            this.setState((cs: CollectingEventState) => ({
              ...cs,
              placeState: {
                ...cs.placeState,
                editingCoordinate: {
                  ...cs.placeState.editingCoordinate,
                  depthAggregated: value,
                  depthLow: depthFrom,
                  depthHigh: depthTo,
                  depthUnit: depthUnit
                }
              }
            }));
          }}
          onChangeCoordinateText={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              let coordinateInvalid: boolean = false;

              if (fieldName === 'coordinateString') {
                coordinateInvalid = !musitCoodinateValidate(fieldName)(value);
              }
              const ps = cs.placeState;

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

              console.log('&&&&&&&&&&& onChangeCoordinateText', ps, fieldName, value);
              const newPlaceState = {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  utmNorthSouth: utmNorthSouth,
                  mgrsBand: mgrsBand,
                  utmZone: utmZone,
                  coordinateGeomertry: coordinateGeomertry,
                  [fieldName]: value
                },
                coordinateInvalid: coordinateInvalid ? coordinateInvalid : false
              };

              return {
                ...cs,
                placeState: newPlaceState
              };
            });
          }}
          onChangeEditMode={(editMode: boolean) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  editCoorditeMode: editMode
                }
              };
            });
          }}
          onChangeCheckBoxBoolean={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
              const s = {
                ...ps,
                editingCoordinate: {
                  ...ps.editingCoordinate,
                  [fieldName]: value
                }
              };
              return {
                ...cs,
                placeState: s
              };
            });
          }}
          getCurrentCoordinate={(ind: number) => {
            const ret = this.state.placeState.editingCoordinate;
            //console.log('anuradha getCurrentCoordinate : ', this.state.placeState.editingCoordinate);
            return ret;
          }}
          onClickSaveRevision={() => {
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
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
                console.log('ANURADHA onClickSaveRevision New Revision');
                return {
                  ...cs,
                  placeState: {
                    ...cs.placeState,
                    editCoorditeMode: false,
                    coordinateHistoryIndeks: ps.coordinateHistory.length - 1,
                    coordinateRevisionType: revType,
                    coordinateHistory: [
                      ...ps.coordinateHistory.slice(0, ps.coordinateHistoryIndeks),
                      {
                        ...ps.coordinateHistory[ps.coordinateHistoryIndeks],
                        coordinateRevisionType: revType,
                        coordinate: ps.editingCoordinate
                      },
                      ...ps.coordinateHistory.slice(ps.coordinateHistoryIndeks + 1)
                    ]
                  }
                };
              }
              console.log('ANURADHA onClickSaveRevision 2 : Edit Mode ');
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  coordinateHistoryIndeks: ps.coordinateHistoryIndeks + 1,
                  coordinateHistory: [
                    ...ps.coordinateHistory,
                    {
                      coordinate: ps.editingCoordinate,
                      coordinateRevisionType: 'coordinateRevision'
                    }
                  ]
                }
              };
            });
          }}
          onClickSaveEdit={() => {
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
              return {
                ...cs,
                ...cs.placeState,
                coordinateHistoryIndeks: ps.coordinateHistory[ps.coordinateHistoryIndeks]
                  .coordinateRevisionType
                  ? ps.coordinateHistoryIndeks + 1
                  : ps.coordinateHistoryIndeks,

                coordinateHistory: ps.coordinateHistory[ps.coordinateHistoryIndeks]
                  .coordinateRevisionType
                  ? [
                      ...cs.placeState.coordinateHistory,
                      {
                        coordinate: ps.editingCoordinate,
                        coordinateRevisionType: 'coordinateEdit',
                        registeredDate: moment().format('DD.MM.YYYY HH:mm'),
                        registeredBy: 'Stein Olsen'
                      }
                    ]
                  : [
                      ...cs.placeState.coordinateHistory,
                      {
                        coordinate: ps.editingCoordinate,
                        coordinateRevisionType: 'newCoordinate'
                      }
                    ]
              };
            });
          }}
          getCurrentHistoryItem={(ind: number) => {
            const ret = this.state.placeState.coordinateHistory[ind];
            return ret;
          }}
          onToggleCollapse={() => {
            this.setState((cs: CollectingEventState) => ({
              ...cs,
              placeState: {
                ...cs.placeState,
                coordinateCollapsed: cs.placeState.coordinateCollapsed ? false : true
              }
            }));
          }}
          onChangeHistoryItem={(fieldName: string) => (value: string) => {
            console.log('OnChangeHistItem', fieldName, value);
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
              const newPlaceState = {
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

              return {
                ...cs,
                placeState: newPlaceState
              };
            });
          }}
        />
      </div>
    );
    const HeaderRead = () => (
      <div>
        <h3>Place</h3>
      </div>
    );
    const HeaderEventMetadata = () => (
      <div>
        <h3>Name and Date</h3>
      </div>
    );

    const EventMetadataComponent = (
      <div>
        <EventMetadata
          {...this.state}
          onChangeEventMetaData={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                eventState: {
                  ...cs.eventState,
                  [fieldName]: value
                }
              };
            });
          }}
          onChangeBornDate={(newDate?: Date) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventState: {
                ...p.eventState,
                eventDateFrom: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onChangeDeathDate={(newDate?: Date) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventState: {
                ...p.eventState,
                eventDateTo: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onClearBornDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventState: {
                ...p.eventState,
                eventDateFrom: undefined
              }
            }));
          }}
          onClearDeathDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventState: {
                ...p.eventState,
                eventDateTo: undefined
              }
            }));
          }}
          onChangeVerbatimDate={(newDate: string) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventState: {
                ...p.eventState,
                eventDateVerbatim: newDate
              }
            }));
          }}
        />
      </div>
    );

    return (
      <div className="container-fluid">
        <form style={{ padding: '20px' }}>
          <div className="row form-group">
            <div className="col-md-8">
              <div className="row">
                <CollapseComponent
                  Head={HeaderEventMetadata()}
                  Body={EventMetadataComponent}
                />
              </div>
              <div className="row">
                <CollapseComponent Head={HeaderRead()} Body={PlaceBodyComponent} />
              </div>
            </div>
            <div className="col-md-4" />
          </div>
        </form>
      </div>
    );
  }
}
