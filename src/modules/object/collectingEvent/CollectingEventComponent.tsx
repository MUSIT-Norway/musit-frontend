import * as React from 'react';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';
import EventMetadata from './EventMetadata';
import { formatISOString } from '../../../shared/util';
import { InputCoordinate, InputCoordinateAttribute } from '../../../models/object/place';
import PlaceComponent, {
  AdmPlace,
  PlaceState,
  MarinePlaceAttribute
} from '../placeStateless/PlaceComponent';
import {
  CollectingEventStoreState,
  PredefinedCollectingEventValues,
  CollectingEventMethod
} from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { OutputCollectingEvent } from '../../../models/object/collectingEvent';
import { AjaxResponse } from 'rxjs';
import config from '../../../config';
import { EditState, NonEditState, RevisionState, DraftState } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';

export type EventMetadataProps = EventData & {
  onChangeEventMetaData: (fieldName: string) => (value: string) => void;
  onClearBornDate: Function;
  onChangeBornDate: Function;
  onClearDeathDate: Function;
  onChangeDeathDate: Function;
  onChangeVerbatimDate: (newDate: string) => void;
  collectingEventMethods: CollectingEventMethod[];
  onSetReadOnlyState?: (value: boolean) => void;
  setDraftState: (fieldName: string, value: boolean) => void;
  readOnly?: boolean;
  isDraft?: boolean;
  showButtonRows?: boolean;
  collectingEventUuid?: string;
  appSession: AppSession;
  history: History;
  setEditMode: () => void;
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

export interface EventData {
  name: string;
  eventUuid: EventUuid;
  eventType: number;
  museumId: number;
  collectionId: number;
  methodId?: number;
  method?: string;
  methodDescription?: string;
  note?: string;
  partOf?: EventUuid;
  createdBy?: PersonUuid; // Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  editingActor?: ActorsAndRelation;
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  editState: EditState | NonEditState;
}

export interface PersonState {
  personUuid: string;
  personName: string;
  personSynonyms: string;
  editState: EditState | NonEditState;
}

export class EventData implements EventData {
  name: string;
  eventUuid: EventUuid;
  eventType: number;
  museumId: number;
  collectionId: number;
  methodId?: number;
  method?: string;
  methodDescription?: string;
  note?: string;
  partOf?: EventUuid;
  createdBy?: PersonUuid; // Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  editingActor?: ActorsAndRelation;
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  editState: EditState | NonEditState;
  constructor(
    name: string,
    eventUuid: EventUuid,
    eventType: number,
    museumId: number,
    collectionId: number,
    editState: EditState | NonEditState,
    methodId?: number,
    method?: string,
    methodDescription?: string,
    note?: string,
    partOf?: EventUuid,
    createdBy?: PersonUuid, // Person
    createdDate?: string,
    relatedActors?: ActorsAndRelation[],
    editingActor?: ActorsAndRelation,
    eventDateFrom?: string,
    eventDateTo?: string,
    eventDateVerbatim?: string
  ) {
    this.name = name;
    this.eventUuid = eventUuid;
    this.methodId = methodId;
    this.museumId = museumId;
    this.eventType = eventType;
    this.collectionId = collectionId;
    this.method = method;
    this.methodDescription = methodDescription;
    this.note = note;
    this.partOf = partOf;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.relatedActors = relatedActors;
    this.editingActor = editingActor;
    this.eventDateFrom = eventDateFrom;
    this.eventDateTo = eventDateTo;
    this.eventDateVerbatim = eventDateVerbatim;
    this.editState = editState;
  }
}

export interface CollectingEventState {
  eventData: EventData;
  placeState: PlaceState;
  personState?: PersonState;
}

export type CollectingProps = {
  addCollectingEvent?: Function;
  getCollectingEvent?: Function;
  setDisabledState: Function;
  setDraftState: (subState?: string) => (fieldName: string) => (value: boolean) => void;
  store: CollectingEventStoreState;
  predefinedCollectingEventValues: PredefinedCollectingEventValues;
  appSession: AppSession;
  history: History;
  eventDataReadOnly: boolean;
  placeReadOnly: boolean;
  personReadOnly: boolean;
  addStateHidden: boolean;
  placeCollapsed: boolean;
  eventDataCollapsed: boolean;
  personCollapsed: boolean;
  isDraft?: boolean;
  saveState?: DraftState | RevisionState;
};

export default (props: CollectingProps) => (
  <CollectingEventComponent
    setDraftState={props.setDraftState}
    setDisabledState={props.setDisabledState}
    appSession={props.appSession}
    predefinedCollectingEventValues={props.predefinedCollectingEventValues}
    store={props.store}
    addCollectingEvent={
      props.addCollectingEvent && props.addCollectingEvent(props.appSession)
    }
    getCollectingEvent={props.getCollectingEvent}
    history={props.history}
    eventDataReadOnly={props.eventDataReadOnly && props.addStateHidden}
    placeReadOnly={props.placeReadOnly && props.addStateHidden}
    personReadOnly={props.personReadOnly && props.addStateHidden}
    personCollapsed={props.personCollapsed}
    placeCollapsed={props.placeCollapsed}
    eventDataCollapsed={props.eventDataCollapsed}
    addStateHidden={props.addStateHidden}
    saveState={props.saveState}
  />
);

export const toFrontend: (p: OutputCollectingEvent) => CollectingEventState = (
  p: OutputCollectingEvent
) => {
  const innP: OutputCollectingEvent = p;

  console.log('TOFrontEnd: ', p);
  if (innP) {
    const r: CollectingEventState = {
      eventData: new EventData(
        innP.name,
        innP.eventUuid,
        innP.eventType,
        innP.museumId,
        innP.collectionId,
        'Not editing',
        innP.methodId,
        innP.method,
        innP.methodDescription,
        innP.note,
        innP.partOf,
        innP.createdBy,
        innP.createdDate,
        innP.relatedActors,
        undefined,
        innP.eventDateFrom,
        innP.eventDateTo,
        innP.eventDateVerbatim
      ),
      placeState: innP.place
        ? {
            admPlace: { ...innP.place.admPlace },
            editingInputCoordinate: { ...innP.place.coordinate },
            editingCoordinateAttribute: { ...innP.place.coordinateAttributes },
            editingAttributes: { ...innP.place.attributes },
            coordinateInvalid: false,
            editState: 'Not editing'
          }
        : { admPlace: null, coordinateInvalid: false, editState: 'Not editing' }
    };

    console.log('TOFrontEnd: after format ', r);
    return r;
  }
  return {
    eventData: {
      name: '',
      eventUuid: '',
      eventType: 6,
      methodId: 4,
      museumId: 5,
      collectionId: 10,
      editState: 'Not editing'
    },

    placeState: {
      admPlace: null,
      editingInputCoordinate: {
        coordinateType: 'MGRS',
        datum: 'WGS84',
        coordinateString: '',
        coordinateGeometry: 'point'
      },
      editingCoordinateAttribute: {
        altitudeUnit: 'Meters',
        depthUnit: 'Meters',
        coordinateCa: false,
        addedLater: false,
        altitudeCa: false,
        depthCa: false
      },
      coordinateInvalid: false,
      editState: 'Not editing'
    }
  };
};

export class CollectingEventComponent extends React.Component<
  CollectingProps,
  CollectingEventState
> {
  constructor(props: CollectingProps) {
    super(props);
    console.log('COLLECTING EVENT STORE', props.store);
    console.log('VIEW MODE : ', props.eventDataReadOnly);
    this.state =
      props.store && props.store.localState
        ? props.store.localState
        : {
            eventData: new EventData(
              '',
              '',
              6,
              4,
              5,
              'Editing',
              10,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined
            ),

            placeState: {
              admPlace: null,
              editingInputCoordinate: {
                coordinateType: 'MGRS',
                datum: 'WGS84',
                coordinateString: '',
                coordinateGeometry: 'point'
              },
              editingCoordinateAttribute: {
                altitudeUnit: 'Meters',
                depthUnit: 'Meters',
                coordinateCa: false,
                addedLater: false,
                altitudeCa: false,
                depthCa: false
              },
              coordinateInvalid: false,
              editState: 'Editing'
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
    console.log('STATE----->', this.state);
    const PlaceBodyComponent = (
      <div>
        <PlaceComponent
          {...this.state.placeState}
          showButtonRow={this.props.addStateHidden}
          collectingEventUUid={this.state.eventData.eventUuid}
          appSession={this.props.appSession}
          coordinatePredefined={{
            coordinatDatumTypes:
              this.props.predefinedCollectingEventValues &&
              this.props.predefinedCollectingEventValues.datums,
            coordinateGeometryTypes:
              this.props.predefinedCollectingEventValues &&
              this.props.predefinedCollectingEventValues.geometryTypes,
            coordinateSourceTypes:
              this.props.predefinedCollectingEventValues &&
              this.props.predefinedCollectingEventValues.coordinateSources,
            coordinateTypes:
              this.props.predefinedCollectingEventValues &&
              this.props.predefinedCollectingEventValues.coordinateTypes
          }}
          history={this.props.history}
          setDraftState={(fieldName: string, value: boolean) =>
            this.props.setDraftState('placeState')(fieldName)(value)
          }
          isDraft={this.props.isDraft}
          setEditMode={() => {
            localStorage.clear();
            localStorage.setItem('editComponent', 'place');
          }}
          readOnly={this.props.placeReadOnly && this.props.addStateHidden ? true : false}
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
            this.setState((s: CollectingEventState) => ({
              ...s,
              placeState: {
                ...s.placeState,
                admPlace: t
              }
            }));
          }}
          getAdmPlaceData={(field: string) => (a: AdmPlace) => {
            let arrayPlaces = a.path ? a.path.split(':') : undefined;
            let PlaceString: string = '';

            if (field === 'Kommune') {
              PlaceString = arrayPlaces ? arrayPlaces[5] : '';
            } else if (field === 'Fylke') {
              PlaceString = arrayPlaces ? arrayPlaces[4] : '';
            } else if (field === 'Land') {
              PlaceString = arrayPlaces ? arrayPlaces[3] : '';
            }
            return PlaceString || '';
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
            const altFrom = A ? parseFloat(A[0]) : undefined;
            const altTo = A ? parseFloat(A[1]) : undefined;
            const altUnit = value.match(/^\d+(\s*\-\s*\d+)?\s*(ft|ft\.|f\.|feet|foot)$/i)
              ? 'Feet'
              : 'Meters';

            this.setState((cs: CollectingEventState) => {
              const newCoordinateAttributes = cs.placeState.editingCoordinateAttribute
                ? {
                    ...cs.placeState.editingCoordinateAttribute,
                    altitudeFrom: altFrom,
                    altitudeTo: altTo,
                    altitudeUnit: altUnit,
                    altitudeString: value
                  }
                : {
                    altitudeFrom: altFrom,
                    altitudeTo: altTo,
                    altitudeUnit: altUnit,
                    altitudeString: value
                  };
              const newPlaceState = {
                ...cs.placeState,
                editingCoordinateAttribute: newCoordinateAttributes
              };
              const newEventState = {
                ...cs,
                placeState: newPlaceState
              };

              return newEventState;
            });
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
                newCoordinateInvalid = !musitCoodinateValidate(
                  cs.placeState.editingInputCoordinate &&
                    cs.placeState.editingInputCoordinate.coordinateType
                )(value);
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
                (value === 'LAT/LONG' && fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingInputCoordinate &&
                  ps.editingInputCoordinate.coordinateType === 'LAT/LONG')
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
              const newEventState = {
                ...cs,
                placeState: newPlaceState
              };
              return newEventState;
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
          onChangeNumberCoordinateAttributes={(fieldName: string) => (value: number) => {
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
          onChangeCheckBoxBoolean={(fieldName: string) => (value: boolean) => {
            this.setState((cs: CollectingEventState) => {
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
              const newEventState = {
                ...cs,
                placeState: newPlaceState
              };
              return newEventState;
            });
          }}
          getCurrentCoordinate={(ind: number) => {
            const ret = this.state.placeState;
            return ret;
          }}
          onClickSave={() => {
            this.setState((cs: CollectingEventState) => {
              const ps = cs.placeState;
              if (!ps.editCoordinateMode) {
                return {
                  ...cs,
                  placeState: {
                    ...cs.placeState,
                    editCoorditeMode: false
                  }
                };
              }
              return {
                ...cs,
                placeState: {
                  ...cs.placeState
                }
                /* coordinateHistoryIndeks: ps.coordinateHistoryIndeks + 1,
                  coordinateHistory: [
                    ...ps.coordinateHistory,
                    {
                      coordinate: ps.editingCoordinate,
                      coordinateRevisionType: 'coordinateRevision'
                    }
                  ] */
              };
            });

            this.props.addCollectingEvent &&
              this.props.addCollectingEvent()({
                data: this.state,
                token: this.props.appSession.accessToken,
                collectionId: this.props.appSession.collectionId,
                callback: {
                  onComplete: (r: AjaxResponse) => {
                    const url = config.magasin.urls.client.collectingEvent.view(
                      this.props.appSession,
                      r.response.eventUuid
                    );
                    this.props.history && this.props.history.replace(url);
                  }
                }
              });
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
        />
      </div>
    );

    const EventMetadataComponent = (
      <div>
        <EventMetadata
          {...this.state.eventData}
          history={this.props.history}
          setEditMode={() => {
            localStorage.clear();
            localStorage.setItem('editComponent', 'eventMetaData');
          }}
          collectingEventUuid={this.state.eventData.eventUuid}
          appSession={this.props.appSession}
          showButtonRows={this.props.addStateHidden}
          onSetReadOnlyState={(value: boolean) =>
            this.props.setDisabledState('eventDataReadOnly')(value)
          }
          setDraftState={(fieldName: string, value: boolean) =>
            this.props.setDraftState('eventData')(fieldName)(value)
          }
          isDraft={this.props.isDraft}
          readOnly={
            this.props.eventDataReadOnly && this.props.addStateHidden ? true : false
          }
          collectingEventMethods={
            this.props.predefinedCollectingEventValues.collectingMethods || []
          }
          onChangeEventMetaData={(fieldName: string) => (value: string) => {
            this.setState((cs: CollectingEventState) => {
              return {
                ...cs,
                eventData: {
                  ...cs.eventData,
                  [fieldName]: value
                }
              };
            });
          }}
          onChangeBornDate={(newDate?: Date) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                eventDateFrom: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onChangeDeathDate={(newDate?: Date) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                eventDateTo: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onClearBornDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                eventDateFrom: undefined
              }
            }));
          }}
          onClearDeathDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                eventDateTo: undefined
              }
            }));
          }}
          onChangeVerbatimDate={(newDate: string) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                eventDateVerbatim: newDate
              }
            }));
          }}
        />
      </div>
    );

    return (
      <div className="container panel panel-default">
        <div className="panel-heading">
          <h1>Collecting event</h1>
        </div>
        <div className="panel-body" style={{ backgroundColor: '#f6f6f2' }}>
          <CollapseComponent
            head="Event data"
            Body={EventMetadataComponent}
            readOnly={this.props.eventDataReadOnly}
            collapsed={this.props.eventDataCollapsed}
          />
          <br />
          <CollapseComponent
            head="Place"
            Body={PlaceBodyComponent}
            readOnly={this.props.placeReadOnly}
            collapsed={this.props.placeCollapsed}
          />
        </div>

        <div className="panel-footer">
          {!this.props.addStateHidden ? (
            <EditAndSaveButtons
              onClickDraft={() => {
                this.props.setDisabledState('addStateReadOnly')(true);
                this.props.setDraftState(undefined)('isDraft')(false);
              }}
              onClickCancel={() => this.props.history.goBack()}
              onClickEdit={() => this.props.setDisabledState('addStateReadOnly')(false)}
              onClickSave={() => {
                this.props.setDraftState(undefined)('isDraft')(false);
                this.props.setDisabledState('addStateReadOnly')(true);

                this.props.addCollectingEvent &&
                  this.props.addCollectingEvent()({
                    data: this.state,
                    token: this.props.appSession.accessToken,
                    collectionId: this.props.appSession.collectionId,
                    callback: {
                      onComplete: (r: AjaxResponse) => {
                        const url = config.magasin.urls.client.collectingEvent.view(
                          this.props.appSession,
                          r.response.eventUuid
                        );
                        this.props.history && this.props.history.replace(url);
                      }
                    }
                  });
              }}
              editButtonState={{
                visible: false,
                disabled: !this.props.addStateHidden
              }}
              cancelButtonState={{
                visible: true,
                disabled: !this.props.addStateHidden
              }}
              saveButtonState={{
                visible: true,
                disabled: this.props.addStateHidden
              }}
              draftButtonState={{
                visible:
                  this.props.isDraft === undefined || this.props.isDraft ? true : false,
                disabled:
                  this.props.addStateHidden &&
                  (this.props.isDraft === undefined || this.props.isDraft ? false : true)
              }}
              saveButtonText="Lagre"
              editButtonText="Endre"
              cancelButtonText="Avbryt"
              draftButtonText="Lagre utkast"
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
