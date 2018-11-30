import * as React from 'react';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';
import EventMetadata from './EventMetadata';
import { formatISOString } from '../../../shared/util';
import { InputCoordinate, InputCoordinateAttribute } from '../../../models/object/place';
import PlaceComponent, {
  AdmPlace,
  PlaceState,
  MarinePlaceAttribute,
  InputPlace,
  toPlaceBackend,
  coordMGRSStrToDerived,
  coordLatLongStrToDerived,
  coordUTMStrToDerived
} from '../placeStateless/PlaceComponent';
import {
  CollectingEventStoreState,
  PredefinedCollectingEventValues,
  CollectingEventMethod,
  EditPlaceProps,
  EditCollectingEventProps
} from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import * as Geodesy from 'geodesy';
import {
  OutputCollectingEvent,
  ActorsAndRelation,
  EventUuid,
  PersonUuid,
  InputCollectingEvent
} from '../../../models/object/collectingEvent';
import { AjaxResponse } from 'rxjs';
import config from '../../../config';
import { EditState, NonEditState, RevisionState, DraftState } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';
import PersonComponent from './PersonComponent';
import { personDet } from '../../../models/object/classHist';
import { PersonName } from '../person/PersonComponent';
import { AjaxPost } from 'src/types/ajax';

export type EventMetadataProps = EventData & {
  onClickSave: () => void;
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
  editingRelatedActors?: ActorsAndRelation;
  relatedActors?: ActorsAndRelation[];
  editingActor?: ActorsAndRelation;
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  editState: EditState | NonEditState;
}

export type PersonNameForCollectingEvent = PersonName & {
  personUuid?: string;
  roleId?: number;
};
export interface PersonState {
  personName?: PersonNameForCollectingEvent;
  persons?: PersonNameForCollectingEvent[];
  editState: EditState | NonEditState;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
}

export class PersonState implements PersonState {
  public personName?: PersonNameForCollectingEvent;
  public personNames?: PersonNameForCollectingEvent[];
  public editState: EditState | NonEditState;
  public disableOnChangeFullName?: boolean;
  public disableOnChangeOtherName?: boolean;
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
    //editingPersonName?: PersonName
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
  editingPlaceState?: InputPlace;
  editingEventData?: EventData;
}

export type CollectingProps = {
  addCollectingEvent?: Function;
  editEventMetaData?: (
    ajaxPost?: AjaxPost<any>
  ) => (props: EditCollectingEventProps) => void;
  editEventAttributesRevision?: (
    ajaxPost?: AjaxPost<any>
  ) => (props: EditCollectingEventProps) => void;
  editEventDateRevision?: (
    ajaxPost?: AjaxPost<any>
  ) => (props: EditCollectingEventProps) => void;
  editEventPlaceRevision?: (ajaxPost?: AjaxPost<any>) => (props: EditPlaceProps) => void;
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

export const toEventDataBackend: (p: CollectingEventState) => InputCollectingEvent = (
  p: CollectingEventState
) => {
  return p.eventData;
};

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
            editState: 'Not editing',
            placeUuid: innP.place.placeUuid
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

    this.savePlace = this.savePlace.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.savePerson = this.savePerson.bind(this);
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
            },
            personState: {
              editState: 'Editing'
            }
          };
    console.log('COLL EVENT STATE : ', this.state);
  }

  componentWillReceiveProps(props: CollectingProps) {
    console.log('Recieve props: ====>', props);
    if (props.store.localState) {
      this.setState(() => ({ ...props.store.localState }));
    }
  }

  savePlace(place: PlaceState) {
    console.log(place, this.state.placeState.placeUuid);

    if (this.props.editEventPlaceRevision && place && place.placeUuid) {
      const URL = config.magasin.urls.client.collectingEvent.view(
        this.props.appSession,
        this.state.eventData.eventUuid
      );
      const props: EditPlaceProps = {
        id: this.state.eventData.eventUuid,
        data: toPlaceBackend(place),
        token: this.props.appSession.accessToken,
        collectionId: this.props.appSession.collectionId,
        callback: {
          onComplete: () => this.props.history.replace(URL)
        }
      };
      console.log(props, URL);
      this.props.editEventPlaceRevision()(props);
    }
  }

  saveEvent(collectingEventState: CollectingEventState) {
    if (
      this.props.editEventMetaData &&
      collectingEventState.eventData &&
      collectingEventState.eventData.eventUuid
    ) {
      const URL = config.magasin.urls.client.collectingEvent.view(
        this.props.appSession,
        this.state.eventData.eventUuid
      );
      const props: EditCollectingEventProps = {
        id: this.state.eventData.eventUuid,
        data: toEventDataBackend(collectingEventState),
        token: this.props.appSession.accessToken,
        collectionId: this.props.appSession.collectionId,
        callback: {
          onComplete: () => this.props.history.replace(URL)
        }
      };

      this.props.editEventMetaData()(props);
    }
  }

  savePerson(personState: PersonState) {}

  render() {
    console.log('STATE----->', this.state);
    const PlaceBodyComponent = (
      <div>
        <PlaceComponent
          {...this.state.placeState}
          showButtonRow={this.props.addStateHidden}
          collectingEventUUid={this.state.eventData.eventUuid}
          appSession={this.props.appSession}
          onCoordinateLatLonKeyPress={e => {
            if (e.charCode === 13) {
              console.log('E', e);

              const datum: Geodesy.datum =
                this.state.placeState.editingInputCoordinate &&
                (this.state.placeState.editingInputCoordinate.datum === 'WGS84' ||
                  this.state.placeState.editingInputCoordinate.datum === 'ED50')
                  ? this.state.placeState.editingInputCoordinate.datum
                  : 'WGS84';

              try {
                const coordStr =
                  this.state.placeState.editingInputCoordinate &&
                  this.state.placeState.editingInputCoordinate.coordinateString;
                const derivedCoordinate =
                  this.state.placeState.editingInputCoordinate &&
                  coordStr &&
                  this.state.placeState.editingInputCoordinate.datum &&
                  this.state.placeState.editingInputCoordinate.coordinateType
                    ? coordLatLongStrToDerived(
                        coordStr,
                        this.state.placeState.editingInputCoordinate.coordinateType,
                        datum
                      )
                    : undefined;
                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    editingInputCoordinate: ps.placeState.editingInputCoordinate
                      ? {
                          ...ps.placeState.editingInputCoordinate,
                          derivedCoordinate: derivedCoordinate
                        }
                      : undefined
                  }
                }));
              } catch (e) {
                console.log(e);
              }
            }
          }}
          onCoordinateUTMKeyPress={e => {
            if (e.charCode === 13) {
              const datum =
                this.state.placeState.editingInputCoordinate &&
                (this.state.placeState.editingInputCoordinate.datum === 'WGS84' ||
                  this.state.placeState.editingInputCoordinate.datum === 'ED50')
                  ? this.state.placeState.editingInputCoordinate.datum
                  : 'WGS84';

              try {
                const coordStr =
                  this.state.placeState.editingInputCoordinate &&
                  this.state.placeState.editingInputCoordinate.coordinateString;
                const derivedCoordinate =
                  this.state.placeState.editingInputCoordinate &&
                  coordStr &&
                  this.state.placeState.editingInputCoordinate.datum &&
                  this.state.placeState.editingInputCoordinate.coordinateType
                    ? coordUTMStrToDerived(
                        coordStr,
                        this.state.placeState.editingInputCoordinate.coordinateType,
                        datum,
                        this.state.placeState.editingInputCoordinate.zone,
                        this.state.placeState.editingInputCoordinate.bend
                          ? this.state.placeState.editingInputCoordinate.bend >= 'N'
                            ? 'N'
                            : 'S'
                          : undefined
                      )
                    : undefined;
                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    editingInputCoordinate: ps.placeState.editingInputCoordinate
                      ? {
                          ...ps.placeState.editingInputCoordinate,
                          derivedCoordinate: derivedCoordinate
                        }
                      : undefined
                  }
                }));
              } catch (e) {
                console.log(e);
              }
            }
          }}
          onCoordinateMGRSKeyPress={e => {
            if (e.charCode === 13) {
              const datum =
                this.state.placeState.editingInputCoordinate &&
                (this.state.placeState.editingInputCoordinate.datum === 'WGS84' ||
                  this.state.placeState.editingInputCoordinate.datum === 'ED50')
                  ? this.state.placeState.editingInputCoordinate.datum
                  : 'WGS84';

              try {
                const coordStr =
                  this.state.placeState.editingInputCoordinate &&
                  this.state.placeState.editingInputCoordinate.coordinateString &&
                  this.state.placeState.editingInputCoordinate.zone &&
                  this.state.placeState.editingInputCoordinate.zone.toString() +
                    this.state.placeState.editingInputCoordinate.bend +
                    this.state.placeState.editingInputCoordinate.coordinateString;
                const derivedCoordinate =
                  this.state.placeState.editingInputCoordinate &&
                  coordStr &&
                  this.state.placeState.editingInputCoordinate.datum &&
                  this.state.placeState.editingInputCoordinate.coordinateType
                    ? coordMGRSStrToDerived(
                        coordStr,
                        this.state.placeState.editingInputCoordinate.coordinateType,
                        datum,
                        this.state.placeState.editingInputCoordinate.zone,
                        this.state.placeState.editingInputCoordinate.bend
                      )
                    : undefined;
                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    editingInputCoordinate: ps.placeState.editingInputCoordinate
                      ? {
                          ...ps.placeState.editingInputCoordinate,
                          derivedCoordinate: derivedCoordinate
                        }
                      : undefined
                  }
                }));
              } catch (e) {
                console.log(e);
              }
            }
          }}
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
              const newPlaceState: PlaceState = {
                ...cs.placeState,
                editingAttributes: newAttributes,
                editState: 'Editing'
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
                editState: 'Editing',
                admPlace: t
              }
            }));
          }}
          getAdmPlaceData={(field: string) => (a: AdmPlace) => {
            const arrayPlaces = a.path ? a.path.split(':') : undefined;
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
          admPlace={this.state.placeState.admPlace}
          editCoordinateMode={this.state.placeState.editCoordinateMode || false}
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
                  editState: 'Editing',
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
              const newPlaceState: PlaceState = {
                ...cs.placeState,
                editState: 'Editing',
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
                editState: 'Editing',
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
              const band =
                ((value === 'MGRS' || value === 'UTM') &&
                  fieldName === 'coordinateType') ||
                (fieldName !== 'coordinateType' &&
                  ps.editingInputCoordinate &&
                  (ps.editingInputCoordinate.coordinateType === 'MGRS' ||
                    ps.editingInputCoordinate.coordinateType === 'UTM'))
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
                    bend: band,
                    zone: zone,
                    coordinateGeometry: coordinateGeometry,
                    [fieldName]: value
                  }
                : { [fieldName]: value };

              const newPlaceState: PlaceState = {
                ...cs.placeState,
                editState: 'Editing',
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
                  editState: 'Editing',
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
                  editState: 'Editing',
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

              const newPlaceState: PlaceState = {
                ...cs.placeState,
                editState: 'Editing',
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
            console.log('Hei');
            this.savePlace(this.state.placeState);
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
          onClickSave={() => this.saveEvent(this.state)}
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
                  editState: 'Editing',
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
                editState: 'Editing',
                eventDateFrom: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onChangeDeathDate={(newDate?: Date) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                editState: 'Editing',
                eventDateTo: newDate ? formatISOString(newDate) : undefined
              }
            }));
          }}
          onClearBornDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                editState: 'Editing',
                eventDateFrom: undefined
              }
            }));
          }}
          onClearDeathDate={() => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                editState: 'Editing',
                eventDateTo: undefined
              }
            }));
          }}
          onChangeVerbatimDate={(newDate: string) => {
            this.setState((p: CollectingEventState) => ({
              ...p,
              eventData: {
                ...p.eventData,
                editState: 'Editing',
                eventDateVerbatim: newDate
              }
            }));
          }}
        />
      </div>
    );

    const PersonComponentBody = (
      <div>
        <PersonComponent
          {...this.state}
          disabled={this.props.personReadOnly ? this.props.personReadOnly : false}
          value={''}
          appSession={this.props.appSession}
          history={this.props.history}
          personNames={
            this.state && this.state.personState ? this.state.personState.personNames : []
          }
          editingPersonName={this.state.personState && this.state.personState.personName}
          disableOnChangeFullName={
            this.state.personState && this.state.personState.disableOnChangeFullName
          }
          disableOnChangeOtherName={
            this.state.personState && this.state.personState.disableOnChangeOtherName
          }
          onChangePerson={(suggestion: personDet) => {
            this.setState((cs: CollectingEventState) => {
              console.log('ANURADHA RETURNED cs ', cs);
              const newPersonName: PersonNameForCollectingEvent = {
                personUuid: suggestion ? suggestion.personUuid : '',
                personNameUuid: suggestion ? suggestion.personNameUuid : '',
                nameString: suggestion ? suggestion.name : '',
                roleId: 15
              };
              console.log('ANURADHA RETURNED SUGGESSTION ', newPersonName);

              const newPersonState: PersonState = {
                ...cs.personState,
                personName: newPersonName,
                editState: 'Editing'
              };

              const newEventState = {
                ...cs,
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onAddPerson={() => {
            this.setState((cs: CollectingEventState) => {
              console.log('ANURADHA RETURNED onAdd cs ', cs);
              const index =
                cs.personState && cs.personState.personNames
                  ? cs.personState.personNames.length
                  : 0;
              const currentPersonNames =
                cs.personState && cs.personState.personNames
                  ? cs.personState.personNames
                  : [];

              const currentPersonName = cs.personState && cs.personState.personName;

              const newPersonNames = [
                ...currentPersonNames.slice(0, index),
                currentPersonName ? currentPersonName : { nameString: '' },
                ...currentPersonNames.slice(index + 1)
              ];

              const newPersonState: PersonState =
                cs && cs.personState
                  ? {
                      ...cs.personState,
                      personNames: newPersonNames,
                      editState: 'Editing'
                    }
                  : {
                      editState: 'Editing'
                    };

              const newEventState = {
                ...cs,
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onDeletePerson={(i: number) => {
            this.setState((cs: CollectingEventState) => {
              console.log('ANURADHA RETURNED onAdd cs ', cs);
              const currentPersonName =
                cs.personState && cs.personState.personNames
                  ? cs.personState.personNames
                  : [];
              const newPersonNames =
                currentPersonName.length === 1
                  ? undefined
                  : [...currentPersonName.slice(0, i), ...currentPersonName.slice(i + 1)];

              const newPersonState: PersonState = cs.personState
                ? {
                    ...cs.personState,
                    personNames: newPersonNames
                  }
                : {
                    personNames: newPersonNames,
                    editState: 'Editing'
                  };

              const newEventState = {
                ...cs,
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onCreatePersonName={(appSession: AppSession) => {
            console.log('Anuradha hit save ', this.state);
            return this.state;
            /* this.props.addPersonName &&
              this.props.addPersonName()({
                data: this.state,
                token: appSession.accessToken,
                collectionId: appSession.collectionId,
                callback: (res: any) => console.log('call back ====> ', res)
              }) */
          }}
          onChangeFullName={(fieldName: string) => (value: string) => {
            this.setState((ps: CollectingEventState) => {
              console.log('ANURADHA in onChangeFullName : ', fieldName, value);
              console.log('onChangeFullName = CollectingEventComp', ps);
              const lastName =
                fieldName === 'lastName'
                  ? value
                  : (ps.personState &&
                      ps.personState.personName &&
                      ps.personState.personName.lastName) ||
                    '';
              const title =
                fieldName === 'title'
                  ? value
                  : (ps.personState &&
                      ps.personState.personName &&
                      ps.personState.personName.title) ||
                    '';
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : (ps.personState &&
                      ps.personState.personName &&
                      ps.personState.personName.firstName) ||
                    '';
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              const disableOnChangeFullName =
                lastName || title || firstName ? true : false;

              let disableOnChangeOtherName = false;
              if (fieldName === 'nameString') {
                disableOnChangeOtherName = true;

                if (value === '') {
                  disableOnChangeOtherName = false;
                }
              }

              const newPersonName =
                ps && ps.personState && ps.personState.personName
                  ? {
                      ...ps.personState.personName,
                      nameString,
                      editState: 'Editing',
                      [fieldName]: value
                    }
                  : {
                      nameString: ''
                    };
              const newPersonState: PersonState = ps.personState
                ? {
                    ...ps.personState,
                    personName: newPersonName,
                    editState: 'Editing',
                    disableOnChangeFullName: disableOnChangeFullName,
                    disableOnChangeOtherName: disableOnChangeOtherName
                  }
                : {
                    editState: 'Editing',
                    disableOnChangeFullName: disableOnChangeFullName,
                    disableOnChangeOtherName: disableOnChangeOtherName
                  };

              const newEventState = {
                ...ps,
                personState: newPersonState
              };
              return newEventState;
            });
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
          {
            <CollapseComponent
              head="Person data"
              Body={PersonComponentBody}
              readOnly={this.props.personReadOnly}
            />
          }{' '}
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
