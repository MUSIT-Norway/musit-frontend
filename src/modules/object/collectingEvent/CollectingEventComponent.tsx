import * as React from 'react';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';
import { Collection, SynonymType, ExternalId } from '../person/PersonComponent';
import EventMetadata from './EventMetadata';
import { formatISOString } from '../../../shared/util';
import PlaceComponent, {
  AdmPlace,
  PlaceState,
  InputCoordinate,
  InputCoordinateAttribute,
  MarinePlaceAttribute
} from '../placeStateless/PlaceComponent';
import { CollectingEventStoreState } from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';

export type CollectingEventProps = {
  onChangeTextField: (fieldName: string) => (value: string) => void;
  onChangeNumberField: (fieldName: string) => (value: number) => void;
};

export type EventMetadataProps = EventState & {
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

export interface EventState {
  name: string;
  eventUuid: EventUuid;
  eventType: number;
  methodId: number;
  museumId: number;
  collectionId: number;
  method?: string;
  methodDescription?: string;
  note?: string;
  partOf?: EventUuid;
  createdBy?: Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
}

export class EventState implements EventState {
  name: string;
  eventUuid: EventUuid;
  eventType: number;
  methodId: number;
  museumId: number;
  collectionId: number;
  method?: string;
  methodDescription?: string;
  note?: string;
  partOf?: EventUuid;
  createdBy?: Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
  constructor(
    name: string,
    eventUuid: EventUuid,
    eventType: number,
    methodId: number,
    museumId: number,
    collectionId: number,
    method?: string,
    methodDescription?: string,
    note?: string,
    partOf?: EventUuid,
    createdBy?: Person,
    createdDate?: string,
    relatedActors?: ActorsAndRelation[],
    eventDateFrom?: string,
    eventDateTo?: string,
    eventDateVerbatim?: string,
    placeUuid?: Uuid
  ) {
    this.name = name;
    this.eventUuid = eventUuid;
    this.eventType = eventType;
    this.methodId = methodId;
    this.museumId = museumId;
    this.collectionId = collectionId;
    this.method = method;
    this.methodDescription = methodDescription;
    this.note = note;
    this.partOf = partOf;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.relatedActors = relatedActors;
    this.eventDateFrom = eventDateFrom;
    this.eventDateTo = eventDateTo;
    this.eventDateVerbatim = eventDateVerbatim;
    this.placeUuid = placeUuid;
  }
}

export interface CollectingEventState {
  placeState: PlaceState;
  eventState: EventState;
}

export class CollectingEventState implements CollectingEventState {
  placeState: PlaceState;
  eventState: EventState;

  constructor(placeState: PlaceState, eventState: EventState, person: Person) {
    this.placeState = placeState;
    this.eventState = eventState;
  }
}

export type CollectingProps = {
  addCollectingEvent?: Function;
  store: CollectingEventStoreState;
  appSession: AppSession;
  history: History;
};

export default (props: CollectingProps) => (
  <CollectingEventComponent
    appSession={props.appSession}
    store={props.store}
    addCollectingEvent={
      props.addCollectingEvent && props.addCollectingEvent(props.appSession)
    }
    history={props.history}
  />
);

export class CollectingEventComponent extends React.Component<
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
              admPlace: null,
              editingInputCoordinate: {
                coordinateType: 'MGRS',
                datum: 'WGS84',
                coordinateString: '',
                coordinateGeometry: 'Point'
              },
              editingCoordinateAttribute: {
                altitudeUnit: 'Meters',
                depthUnit: 'Meters',
                coordinateCa: false,
                addedLater: false,
                altitudeCa: false,
                depthCa: false
              },
              coordinateInvalid: false
            },
            eventState: {
              name: '',
              eventUuid: '',
              eventType: 6,
              methodId: 4,
              museumId: 5,
              collectionId: 10
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
    console.log('CollectionEventState on load anuradha ', this.state.placeState);

    const PlaceBodyComponent = (
      <div>
        <PlaceComponent
          {...this.state}
          appSession={this.props.appSession}
          history={this.props.history}
          onChangeOthers={(field: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              const newAttributes: MarinePlaceAttribute = cs.placeState.editingAttributes
                ? { ...cs.placeState.editingAttributes, [field]: value }
                : { [field]: value };
              const newPlaceState = {
                ...cs.placeState,
                editingAttributes: newAttributes
              };
              return {
                ...cs,
                placeState: newPlaceState
              };
            });
          }}
          onChangeAdmPlace={(t: AdmPlace) => {
            console.log(t);
            this.setState((s: CollectingEventState) => ({
              ...s,
              placeState: {
                ...s.placeState,
                admPlace: t
              }
            }));
          }}
          // Cordinate Props

          /*           {...this.state.placeState.coordinateHistory[
            this.state.placeState.coordinateHistoryIndeks
          ].coordinate} */
          admPlace={this.state.placeState.admPlace}
          editCoordinateMode={this.state.placeState.editCoordinateMode || false}
          //coordinateHistoryIndeks={this.state.placeState.coordinateHistoryIndeks}
          //coordinateHistory={this.state.placeState.coordinateHistory}
          editingInputCoordinate={
            this.state.placeState && this.state.placeState.editingInputCoordinate
          }
          editingCoordinateAttribute={
            this.state.placeState && this.state.placeState.editingCoordinateAttribute
          }
          editingAttributes={
            this.state.placeState && this.state.placeState.editingAttributes
          }
          coordinateType={
            (this.state.placeState.editingInputCoordinate &&
              this.state.placeState.editingInputCoordinate.coordinateType) ||
            'MGRS'
          }
          coordinateInvalid={this.state.placeState.coordinateInvalid || false}
          coordinateCollapsed={this.state.placeState.coordinateCollapsed || false}
          onChangeCoordinateNumber={(fieldName: string) => (value: number) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  editingCoordinateAttribute: {
                    ...cs.placeState.editingCoordinateAttribute,
                    [fieldName]: value
                  }
                }
              };
            });
          }}
          /* onSetEditingIndex={(i: number) => {
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
          }} */
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
                editingCoordinateAttribute: {
                  ...cs.placeState.editingCoordinateAttribute,
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
                editingCoordinateAttribute: {
                  ...cs.placeState.editingCoordinateAttribute,
                  depthAggregated: value,
                  depthLow: depthFrom,
                  depthHigh: depthTo,
                  depthUnit: depthUnit
                }
              }
            }));
          }}
          /* Reveiw the logic since in new types below fields are not available. 
                  utmZone?: number;
                  mgrsBand?: string;
                  utmNorthSouth?: string
              
              const utmNorthSouth =
                (value === 'UTM' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingCoordinate.coordinate.coordinateType === 'UTM')
                  ? ps.editingCoordinate.utmNorthSouth
                  : undefined; */

          onChangeCoordinateText={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              let newCoordinateInvalid: boolean = false;

              if (fieldName === 'coordinateString') {
                newCoordinateInvalid = !musitCoodinateValidate(fieldName)(value);
              }
              const ps = cs.placeState;
              const bend =
                (value === 'MGRS' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingInputCoordinate &&
                  ps.editingInputCoordinate.coordinateType === 'MGRS')
                  ? ps.editingInputCoordinate && ps.editingInputCoordinate.bend
                  : undefined;

              const zone =
                ((value === 'MGRS' || value === 'UTM') &&
                  fieldName === 'coordinateType') ||
                ((fieldName !== 'coordinateType' &&
                  ps.editingInputCoordinate &&
                  ps.editingInputCoordinate.coordinateType === 'MGRS') ||
                  (ps.editingInputCoordinate &&
                    ps.editingInputCoordinate.coordinateType === 'UTM'))
                  ? ps.editingInputCoordinate && ps.editingInputCoordinate.zone
                  : undefined;

              const coordinateGeometry =
                (value === 'Lat / Long' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingInputCoordinate &&
                  ps.editingInputCoordinate.coordinateType === 'Lat / Long')
                  ? ps.editingInputCoordinate &&
                    ps.editingInputCoordinate.coordinateGeometry
                  : undefined;

              const newInputCoordinate: InputCoordinate = cs.placeState
                .editingInputCoordinate
                ? {
                    ...cs.placeState.editingInputCoordinate,
                    bend: bend,
                    zone: zone,
                    coordinateGeometry: coordinateGeometry,
                    [fieldName]: value
                  }
                : { [fieldName]: value };

              const newPlaceState = {
                ...cs.placeState,
                editingInputCoordinate: newInputCoordinate,
                coordinateInvalid: newCoordinateInvalid
              };
              return {
                ...cs,
                placeState: newPlaceState
              };
            });
          }}
          onChangeCoordinateAttributes={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                placeState: {
                  ...cs.placeState,
                  editingCoordinateAttribute: {
                    ...cs.placeState.editingCoordinateAttribute,
                    [fieldName]: value
                  }
                }
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
          onChangeCheckBoxBoolean={(fieldName: string) => (value: boolean) => {
            this.setState((cs: CollectingEventState) => {
              console.log('anuradha : onChangeCheckBoxBoolean ', fieldName, value);
              const newCoordinateAttributes: InputCoordinateAttribute = cs.placeState
                .editingCoordinateAttribute
                ? {
                    ...cs.placeState.editingCoordinateAttribute,
                    [fieldName]: value
                  }
                : { [fieldName]: value };

              const newPlaceState = {
                ...cs.placeState,
                editingCoordinateAttribute: newCoordinateAttributes
              };
              return {
                ...cs,
                placeState: newPlaceState
              };
            });
          }}
          getCurrentCoordinate={(ind: number) => {
            const ret = this.state.placeState;
            //console.log('anuradha getCurrentCoordinate : ', this.state.placeState.editingCoordinate);
            return ret;
          }}
          onClickSaveRevision={() => {
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
              if (!ps.editCoordinateMode) {
                console.log(
                  'ANURADHA onClickSaveRevision New Revision App Session',
                  this.props.appSession
                );
                return {
                  ...cs,
                  placeState: {
                    ...cs.placeState,
                    editCoorditeMode: false
                  }
                };
              }
              console.log('ANURADHA onClickSaveRevision 2 : Edit Mode ');
              return {
                ...cs,
                placeState: {
                  ...cs.placeState
                  /* coordinateHistoryIndeks: ps.coordinateHistoryIndeks + 1,
                  coordinateHistory: [
                    ...ps.coordinateHistory,
                    {
                      coordinate: ps.editingCoordinate,
                      coordinateRevisionType: 'coordinateRevision'
                    }
                  ] */
                }
              };
            });
            this.props.addCollectingEvent &&
              this.props.addCollectingEvent()({
                data: this.state.eventState,
                token: this.props.appSession.accessToken,
                collectionId: this.props.appSession.collectionId
              });
          }}
          /*           getCurrentHistoryItem={(ind: number) => {
            const ret = this.state.placeState.coordinateHistory[ind];
            return ret;
          }}*/
          onToggleCollapse={() => {
            this.setState((cs: CollectingEventState) => ({
              ...cs,
              placeState: {
                ...cs.placeState,
                coordinateCollapsed: cs.placeState.coordinateCollapsed ? false : true
              }
            }));
          }}
          /* onChangeHistoryItem={(fieldName: string) => (value: string) => {
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
          }} */
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
          {...this.state.eventState}
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
