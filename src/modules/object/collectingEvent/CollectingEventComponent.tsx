import * as React from 'react';
import { musitCoodinateValidate } from '../../../shared/util';
import CollapseComponent from '../components/Collapse';
import EventMetadata, { ViewEventMetaData } from './EventMetadata';
import { formatISOString, maybeFormatISOString } from '../../../shared/util';
import { emitError } from '../../../shared/errors';
import {
  InputCoordinate,
  InputCoordinateAttribute,
  DerivedCoordinate
} from '../../../models/object/place';
import PlaceComponent, {
  AdmPlace,
  PlaceState,
  MarinePlaceAttribute,
  InputPlace,
  toPlaceBackend,
  coordMGRSStrToDerived,
  coordLatLongStrToDerived,
  coordUTMStrToDerived,
  PlaceView
} from '../placeStateless/PlaceComponent';
import {
  CollectingEventStoreState,
  PredefinedCollectingEventValues,
  CollectingEventMethod,
  EditPlaceProps,
  EditCollectingEventProps,
  EditPersonEventProps
} from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import * as Geodesy from 'geodesy';
import {
  OutputEvent,
  ActorsAndRelation,
  EventUuid,
  PersonUuid,
  InputEvent,
  CollectingEvent
} from '../../../models/object/collectingEvent';
import { AjaxResponse } from 'rxjs';
import config from '../../../config';
import {
  EditState,
  NonEditState,
  RevisionState,
  DraftState,
  PersonSelectedMode
} from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';
import PersonComponent, { ViewPersonComponent } from './PersonComponent';
//import { personDet } from '../../../models/object/classHist';
import { AjaxPost } from 'src/types/ajax';
import { PersonState } from './PersonComponent';
//import { InputPersonName } from '../../../models/object/person';
import { PersonNameSuggestion } from '../../../components/suggest/PersonNameSuggest';
import {
  PersonNameForCollectingEvent,
  InputPersonName
} from '../../../models/object/person';

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
  formInvalid: boolean;
  isDraft?: boolean;
  showButtonRows?: boolean;
  collectingEventUuid?: string;
  appSession: AppSession;
  history: History;
  setEditMode: () => void;
};

export type EventEditMetadataProps = {
  onClickEdit: () => void;
} & EventData;

export type Uuid = string;
export type EventUuid = Uuid;
export type RoleId = number;
export type PersonUuid = Uuid;
export type PersonNameUuid = Uuid;

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
  editEventPersonRevision?: (
    ajaxPost?: AjaxPost<any>
  ) => (props: EditPersonEventProps) => void;
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
  addPersonName: Function;
  addPerson: Function;
  getPersonName: Function;
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
    addPersonName={props.addPersonName}
    addPerson={props.addPerson}
    getPersonName={props.getPersonName}
  />
);

export const toEventDataBackend: (p: CollectingEventState) => InputEvent = (
  p: CollectingEventState
) => {
  return new CollectingEvent(
    p.eventData.eventUuid,
    p.eventData.eventType,
    p.eventData.museumId,
    p.eventData.collectionId,
    p.eventData.name,
    p.eventData.methodId,
    p.eventData.method,
    p.eventData.methodDescription,
    p.eventData.note,
    p.eventData.partOf,
    p.eventData.createdBy,
    p.eventData.createdDate,
    p.eventData.relatedActors,
    p.eventData.eventDateFrom,
    p.eventData.eventDateTo,
    p.eventData.eventDateVerbatim,
    p.placeState.placeUuid
  );
};

export const toFrontend: (p: OutputEvent) => CollectingEventState = (p: OutputEvent) => {
  const innP: OutputEvent = p;

  console.log('TOFrontEnd: ', p);
  if (innP) {
    const r: CollectingEventState = {
      eventData: new EventData(
        (innP.attributes && innP.attributes.name) || 'Dummy',
        innP.eventUuid,
        innP.eventTypeId,
        innP.museumId,
        innP.collectionId,
        'Not editing',
        innP.attributes && innP.attributes.methodId,
        innP.attributes && innP.attributes.method,
        undefined,
        innP.attributes && innP.attributes.note,
        innP.partOf,
        innP.createdBy,
        innP.createdDate,
        innP.relatedActors,
        undefined,
        maybeFormatISOString(innP.eventDateFrom),
        maybeFormatISOString(innP.eventDateTo),
        innP.eventDateVerbatim
      ),
      personState: innP.relatedActors
        ? {
            personNames: innP.relatedActors.map((r: ActorsAndRelation) => ({
              actorUuid: r.actorUuid,
              actorNameUuid: r.actorNameUuid,
              name: r.name,
              roleId: r.roleId,
              defaultName: r.defaultName,
              orderNo: r.orderNo
            })),
            editState: 'Not editing',
            personSelectedMode: 'NoPersonName'
          }
        : undefined,
      placeState: innP.place
        ? {
            admPlace: { ...innP.place.admPlace },
            editingInputCoordinate: innP.place.coordinate
              ? { ...innP.place.coordinate }
              : undefined,
            showCoordinateFormat: false,
            editingCoordinateAttribute: { ...innP.place.coordinateAttributes },
            editingAttributes: { ...innP.place.attributes },
            coordinateInvalid: false,
            editState: 'Not editing',
            placeUuid: innP.place.placeUuid
          }
        : {
            admPlace: null,
            showCoordinateFormat: false,
            coordinateInvalid: false,
            editState: 'Not editing'
          }
    };
    return r;
  }
  return {
    eventData: {
      name: '',
      eventUuid: '',
      eventType: 6,
      methodId: undefined,
      museumId: 5,
      collectionId: 10,
      editState: 'Not editing'
    },

    placeState: {
      admPlace: null,
      showCoordinateFormat: false,
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
    this.formInvalid = this.formInvalid.bind(this);
    this.addAndSaveCollecingEvent = this.addAndSaveCollecingEvent.bind(this);
    this.state =
      props.store && props.store.localState
        ? {
            ...props.store.localState,
            placeState: props.store.localState.placeState
              ? {
                  ...props.store.localState.placeState,
                  selectedCountry: localStorage['selectedCountry']
                }
              : {
                  admPlace: null,
                  showCoordinateFormat: false,
                  editingInputCoordinate: {
                    coordinateType: 'MGRS',
                    datum: 'WGS84',
                    coordinateString: '',
                    coordinateGeometry: 'point'
                  },
                  selectedCountry: localStorage['selectedCountry'],
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
          }
        : {
            eventData: new EventData(
              '',
              '',
              6,
              4,
              5,
              'Editing',
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
              undefined,
              undefined
            ),

            placeState: {
              admPlace: null,
              showCoordinateFormat: false,
              editingInputCoordinate: {
                coordinateType: 'MGRS',
                datum: 'WGS84',
                coordinateString: '',
                coordinateGeometry: 'point'
              },
              selectedCountry: localStorage['selectedCountry'],
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
              showMoreInfo: false,
              editState: 'Editing'
            }
          };
  }

  componentWillReceiveProps(props: CollectingProps) {
    if (props.store.localState) {
      this.setState(() => ({ ...props.store.localState }));
    }
  }

  addAndSaveCollecingEvent() {
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
  }

  formInvalid() {
    return false;
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
        data: { ...toPlaceBackend(place), methodId: this.state.eventData.methodId },
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

  savePerson(personState: PersonState) {
    if (this.props.editEventPersonRevision && personState) {
      const URL = config.magasin.urls.client.collectingEvent.view(
        this.props.appSession,
        this.state.eventData.eventUuid
      );
      const props: EditPersonEventProps = {
        id: this.state.eventData.eventUuid,
        data: this.state.eventData.relatedActors
          ? this.state.eventData.relatedActors
          : [],
        token: this.props.appSession.accessToken,
        collectionId: this.props.appSession.collectionId,
        callback: {
          onComplete: () => this.props.history.replace(URL)
        }
      };
      this.props.editEventPersonRevision()(props);
    }
  }

  render() {
    console.log('STATE----->', this.state);
    console.log(
      'STATE PersonSelectedMode----->',
      this.state && this.state.personState && this.state.personState.personSelectedMode
    );
    const PersonViewComponent = this.state.personState ? (
      <div>
        {' '}
        <ViewPersonComponent
          personNames={this.state.personState ? this.state.personState.personNames : []}
        />
      </div>
    ) : (
      <div />
    );
    const PlaceViewComponent = (
      <div>
        <PlaceView
          {...this.state.placeState}
          onClickEdit={() => {
            const URL =
              this.props.store.collectingEvent && this.state.eventData.eventUuid
                ? config.magasin.urls.client.collectingEvent.edit(
                    this.props.appSession,
                    this.state.eventData.eventUuid
                  )
                : undefined;
            if (URL) {
              localStorage.clear();
              localStorage.setItem('editComponent', 'place');
              this.props.history.push(URL);
            }
          }}
        />
      </div>
    );
    const PlaceBodyComponent = (
      <div>
        <PlaceComponent
          {...this.state.placeState}
          formInvalid={this.formInvalid()}
          nameEmpty={this.state.eventData.name === '' ? true : false}
          toggleShowMap={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            this.setState((p: CollectingEventState) => {
              let derivedCoordinate: DerivedCoordinate | undefined;

              const editingCoordinate = p.placeState.editingInputCoordinate;
              if (editingCoordinate && !this.state.placeState.coordinateInvalid) {
                derivedCoordinate =
                  editingCoordinate.coordinateType === 'MGRS' &&
                  editingCoordinate.bend &&
                  editingCoordinate.zone
                    ? coordMGRSStrToDerived(
                        editingCoordinate.coordinateString || '',
                        'MGRS',
                        editingCoordinate.datum,
                        editingCoordinate.zone,
                        editingCoordinate.bend
                      )
                    : editingCoordinate.coordinateType === 'LAT/LONG'
                      ? coordLatLongStrToDerived(
                          editingCoordinate.coordinateString || '',
                          'LAT/LONG',
                          editingCoordinate.datum
                        )
                      : editingCoordinate.coordinateType === 'UTM' &&
                        editingCoordinate.bend &&
                        editingCoordinate.zone
                        ? coordUTMStrToDerived(
                            editingCoordinate.coordinateString || '',
                            'MGRS',
                            editingCoordinate.datum,
                            editingCoordinate.zone,
                            editingCoordinate.bend
                          )
                        : undefined;
              }

              return {
                ...p,
                placeState: {
                  ...p.placeState,
                  showMap: p.placeState.showMap ? false : true,
                  editingInputCoordinate: p.placeState.editingInputCoordinate
                    ? {
                        ...p.placeState.editingInputCoordinate,
                        derivedCoordinate: derivedCoordinate
                      }
                    : undefined
                }
              };
            });
          }}
          showButtonRow={this.props.addStateHidden}
          collectingEventUUid={this.state.eventData.eventUuid}
          methodId={this.state.eventData.methodId}
          onChangeMethod={(methodId: string) => {
            this.setState((ps: CollectingEventState) => ({
              ...ps,
              eventData: { ...ps.eventData, methodId: Number.parseInt(methodId) },
              placeState: { ...ps.placeState, editState: 'Editing' }
            }));
          }}
          collectingEventMethods={
            this.props.predefinedCollectingEventValues.collectingMethods || []
          }
          appSession={this.props.appSession}
          countries={this.props.predefinedCollectingEventValues.countries.sort()}
          onSelectCountry={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const v = e.target.value;
            localStorage['selectedCountry'] = v;
            this.setState((ps: CollectingEventState) => ({
              ...ps,
              placeState: { ...ps.placeState, selectedCountry: v }
            }));
          }}
          onCoordinateLatLonKeyPress={e => {
            if (e.charCode === 13) {
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
                  !this.state.placeState.coordinateInvalid &&
                  this.state.placeState.editingInputCoordinate.coordinateType
                    ? coordLatLongStrToDerived(
                        coordStr,
                        this.state.placeState.editingInputCoordinate.coordinateType,
                        datum
                      )
                    : undefined;
                const showCoordinateFormat = false;
                if (this.state.placeState.coordinateInvalid) {
                  emitError({ type: 'latLongError', message: '' });
                }

                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    showCoordinateFormat,
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
                  !this.state.placeState.coordinateInvalid &&
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
                const showCoordinateFormat = false;
                if (this.state.placeState.coordinateInvalid) {
                  emitError({ type: 'utmError', message: '' });
                }

                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    showCoordinateFormat,
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
                  !this.state.placeState.coordinateInvalid &&
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
                const showCoordinateFormat = false;
                if (this.state.placeState.coordinateInvalid) {
                  emitError({ type: 'mgrsError', message: '' });
                }
                this.setState((ps: CollectingEventState) => ({
                  ...ps,
                  placeState: {
                    ...ps.placeState,
                    showCoordinateFormat,
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
              const i_val = fieldName === 'bend' ? value.toUpperCase() : value;

              if (fieldName === 'coordinateString') {
                newCoordinateInvalid = !musitCoodinateValidate(
                  cs.placeState.editingInputCoordinate &&
                    cs.placeState.editingInputCoordinate.coordinateType
                )(value);
              }
              if (
                fieldName === 'coordinateType' &&
                cs.placeState.editingInputCoordinate &&
                cs.placeState.editingInputCoordinate.coordinateString
              ) {
                newCoordinateInvalid = !musitCoodinateValidate(value)(
                  cs.placeState.editingInputCoordinate &&
                    cs.placeState.editingInputCoordinate.coordinateString
                );
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
                    [fieldName]: i_val
                  }
                : { datum: 'WGS84', [fieldName]: i_val };

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
            if (this.props.addCollectingEvent) {
              this.addAndSaveCollecingEvent();
            } else {
              this.savePlace(this.state.placeState);
            }
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
    const ViewEventMetaDataComp = (
      <ViewEventMetaData
        {...this.state.eventData}
        onClickEdit={() => {
          const URL =
            this.props.store.collectingEvent && this.state.eventData.eventUuid
              ? config.magasin.urls.client.collectingEvent.edit(
                  this.props.appSession,
                  this.state.eventData.eventUuid
                )
              : undefined;
          if (URL) {
            localStorage.clear();
            localStorage.setItem('editComponent', 'eventMetaData');
            this.props.history.push(URL);
          }
        }}
      />
    );

    const EventMetadataComponent = (
      <div>
        <EventMetadata
          {...this.state.eventData}
          formInvalid={this.formInvalid()}
          history={this.props.history}
          onClickSave={() => {
            if (this.props.addCollectingEvent) {
              this.addAndSaveCollecingEvent();
            } else {
              this.saveEvent(this.state);
            }
          }}
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
          readOnly={this.props.personReadOnly ? this.props.personReadOnly : false}
          value={''}
          appSession={this.props.appSession}
          history={this.props.history}
          personSelectedMode={
            this.state &&
            this.state.personState &&
            this.state.personState.personSelectedMode
          }
          personNames={
            this.state && this.state.personState ? this.state.personState.personNames : []
          }
          formInvalid={this.formInvalid()}
          disableOnChangeFullName={
            this.state.personState && this.state.personState.disableOnChangeFullName
          }
          disableOnChangeOtherName={
            this.state.personState && this.state.personState.disableOnChangeOtherName
          }
          editingPersonName={
            this.state &&
            this.state.personState &&
            this.state.personState.editingPersonName
          }
          editingPerson={
            this.state && this.state.personState && this.state.personState.editingPerson
          }
          selectedPerson={
            this.state && this.state.personState && this.state.personState.personName
          }
          showMoreInfo={this.state.personState && this.state.personState.showMoreInfo}
          nameEmpty={this.state.eventData.name === '' ? true : false}
          onClickEdit={() => {
            const URL =
              this.state.eventData && this.state.eventData.eventUuid
                ? config.magasin.urls.client.collectingEvent.edit(
                    this.props.appSession,
                    this.state.eventData.eventUuid
                  )
                : undefined;
            if (URL) {
              localStorage.clear();
              localStorage.setItem('editComponent', 'person');
              this.props.history.push(URL);
            }
          }}
          onClickSave={() => {
            if (this.props.addCollectingEvent) {
              this.addAndSaveCollecingEvent();
            } else {
              if (this.state.personState) {
                this.savePerson(this.state.personState);
              }
            }
          }}
          onChangePerson={(suggestion: PersonNameSuggestion) => {
            this.setState((cs: CollectingEventState) => {
              const index =
                cs && cs.personState && cs.personState.personNames
                  ? cs.personState.personNames.length
                  : 0;

              const newPersonName: PersonNameForCollectingEvent = {
                actorUuid: suggestion ? suggestion.actorUuid : '',
                actorNameUuid: suggestion ? suggestion.actorNameUuid : '',
                name: suggestion ? suggestion.name : '',
                roleId: 11,
                defaultName: suggestion.defaultName,
                firstName: suggestion ? suggestion.firstName : '',
                lastName: suggestion ? suggestion.lastName : '',
                title: suggestion ? suggestion.title : '',
                orderNo: index
              };
              const newPersonSelectedMode: PersonSelectedMode = 'PersonName';
              const newPersonState: PersonState = {
                ...cs.personState,
                personName: newPersonName,
                editState: 'Editing',
                personSelectedMode: newPersonSelectedMode,
                editingPerson: newPersonName
              };

              const newEventState = {
                ...cs,
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onChangeSecondPerson={(suggestion: PersonNameSuggestion) => {
            this.setState((cs: CollectingEventState) => {
              const personSelectedMode =
                cs && cs.personState && cs.personState.personSelectedMode;

              let newPersonSelectedMode: PersonSelectedMode =
                personSelectedMode === 'PersonName'
                  ? 'PersonAndPersonName'
                  : personSelectedMode === 'NoPersonName'
                    ? 'PersonOrPersonName'
                    : 'NA';

              const newActorId = suggestion.actorUuid;
              const newDefaultName = suggestion.name;
              const orgActorNameUuid =
                (cs.personState &&
                  cs.personState.personName &&
                  cs.personState.personName.actorNameUuid) ||
                '';
              const orgActorName =
                (cs.personState &&
                  cs.personState.personName &&
                  cs.personState.personName.name) ||
                '';

              const index =
                cs && cs.personState && cs.personState.personNames
                  ? cs.personState.personNames.length
                  : 0;

              const editPerson: PersonNameForCollectingEvent = {
                actorUuid: suggestion ? suggestion.actorUuid : '',
                actorNameUuid: suggestion ? suggestion.actorNameUuid : '',
                defaultName: suggestion ? suggestion.name : '',
                roleId: 11,
                name: '',
                orderNo: index
              };

              const mergePersonToPersonName: PersonNameForCollectingEvent = {
                actorUuid: newActorId,
                defaultName: newDefaultName,
                actorNameUuid: orgActorNameUuid,
                name: orgActorName,
                roleId: 11,
                orderNo: index
              };
              const newPersonState: PersonState = {
                ...cs.personState,
                personName: mergePersonToPersonName,
                editingPerson: editPerson,
                editState: 'Editing',
                personSelectedMode: newPersonSelectedMode
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
              const index =
                cs.personState && cs.personState.personNames
                  ? cs.personState.personNames.length
                  : 0;
              const currentPersonNames =
                cs.personState && cs.personState.personNames
                  ? cs.personState.personNames
                  : [];

              const currentPersonName = cs.personState && cs.personState.personName;

              const newPersonNames = currentPersonName
                ? [
                    ...currentPersonNames.slice(0, index),
                    currentPersonName,
                    ...currentPersonNames.slice(index + 1)
                  ]
                : undefined;

              const newPersonState: PersonState =
                cs && cs.personState
                  ? {
                      ...cs.personState,
                      personName: undefined,
                      personNames: newPersonNames,
                      editingPersonName: undefined,
                      editingPerson: undefined,
                      editState: 'Editing',
                      personSelectedMode: 'NoPersonName',
                      showMoreInfo: false
                    }
                  : {
                      editState: 'Editing',
                      personSelectedMode: 'NoPersonName'
                    };

              const relatedActorsList: ActorsAndRelation[] | undefined =
                newPersonNames &&
                newPersonNames.map((p: PersonNameForCollectingEvent) => ({
                  actorUuid: p.actorUuid,
                  actorNameUuid: p.actorNameUuid,
                  roleId: p.roleId,
                  name: p.name,
                  orderNo: p.orderNo
                }));
              const newEventState: CollectingEventState = {
                ...cs,
                eventData: {
                  ...cs.eventData,
                  relatedActors: relatedActorsList
                },
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onDeletePerson={(i: number) => {
            this.setState((cs: CollectingEventState) => {
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
                    personNames: newPersonNames,
                    personSelectedMode: 'NoPersonName'
                  }
                : {
                    personNames: newPersonNames,
                    editState: 'Editing',
                    personSelectedMode: 'NoPersonName'
                  };

              const relatedActorsList: ActorsAndRelation[] | undefined =
                newPersonNames &&
                newPersonNames.map((p: PersonNameForCollectingEvent) => ({
                  actorUuid: p.actorUuid,
                  actorNameUuid: p.actorNameUuid,
                  roleId: p.roleId,
                  name: p.name,
                  orderNo: p.orderNo
                }));
              const newEventState = {
                ...cs,
                eventData: {
                  ...cs.eventData,
                  relatedActors: relatedActorsList
                },
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onCreatePersonName={(appSession: AppSession) => {
            this.props.addPersonName &&
              this.props.addPersonName()({
                data: (this.state &&
                  this.state.personState &&
                  this.state.personState.editingPersonName) || { name: '' },
                token: appSession.accessToken,
                collectionId: appSession.collectionId,
                callback: {
                  onComplete: (res: AjaxResponse) => {
                    this.setState((ps: CollectingEventState) => {
                      const index =
                        ps.personState && ps.personState.personNames
                          ? ps.personState.personNames.length
                          : 0;
                      const currentPersonNames =
                        ps.personState && ps.personState.personNames
                          ? ps.personState.personNames
                          : [];

                      const newPersonName: ActorsAndRelation = {
                        actorUuid:
                          ps &&
                          ps.personState &&
                          ps.personState.editingPerson &&
                          ps.personState.editingPerson.actorUuid,
                        defaultName:
                          ps &&
                          ps.personState &&
                          ps.personState.editingPerson &&
                          ps.personState.editingPerson.defaultName,
                        actorNameUuid: res.response.actorNameUuid,
                        name: res.response.name,
                        roleId: 11,
                        orderNo: index
                      };
                      const newPersonNames = newPersonName
                        ? [
                            ...currentPersonNames.slice(0, index),
                            newPersonName,
                            ...currentPersonNames.slice(index + 1)
                          ]
                        : undefined;

                      const currStatus = ps.personState && ps.personState.showMoreInfo;
                      const newPersonState: PersonState = {
                        ...ps.personState,
                        personNames: newPersonNames,
                        editState: 'Editing',
                        personName: undefined,
                        editingPersonName: undefined,
                        editingPerson: undefined,
                        showMoreInfo: !currStatus,
                        personSelectedMode: 'NoPersonName'
                      };

                      const relatedActorsList: ActorsAndRelation[] | undefined =
                        newPersonNames &&
                        newPersonNames.map((p: PersonNameForCollectingEvent) => ({
                          actorUuid: p.actorUuid,
                          actorNameUuid: p.actorNameUuid,
                          roleId: p.roleId,
                          name: p.name,
                          orderNo: p.orderNo
                        }));

                      const newEventState = {
                        ...ps,
                        eventData: {
                          ...ps.eventData,
                          relatedActors: relatedActorsList
                        },
                        personState: newPersonState
                      };
                      return newEventState;
                    });
                  }
                }
              });
          }}
          onCreateNewPerson={(appSession: AppSession) => {
            this.props.addPerson &&
              this.props.addPerson()({
                data: (this.state &&
                  this.state.personState &&
                  this.state.personState.editingPersonName) || { name: '' },
                token: appSession.accessToken,
                collectionId: appSession.collectionId,
                callback: {
                  onComplete: (res: AjaxResponse) => {
                    this.setState((ps: CollectingEventState) => {
                      const index =
                        ps.personState && ps.personState.personNames
                          ? ps.personState.personNames.length
                          : 0;
                      const currentPersonNames =
                        ps.personState && ps.personState.personNames
                          ? ps.personState.personNames
                          : [];

                      const newPersonName: ActorsAndRelation = {
                        actorUuid: res.response.actorUuid,
                        defaultName: res.response.name,
                        actorNameUuid: res.response.actorNameUuid,
                        name: res.response.name,
                        roleId: 11,
                        orderNo: index
                      };

                      const newPersonNames = newPersonName
                        ? [
                            ...currentPersonNames.slice(0, index),
                            newPersonName,
                            ...currentPersonNames.slice(index + 1)
                          ]
                        : undefined;

                      const currStatus = ps.personState && ps.personState.showMoreInfo;
                      const newPersonState: PersonState = {
                        ...ps.personState,
                        personNames: newPersonNames,
                        editState: 'Editing',
                        personName: undefined,
                        editingPersonName: undefined,
                        editingPerson: undefined,
                        showMoreInfo: !currStatus,
                        personSelectedMode: 'NoPersonName'
                      };

                      const relatedActorsList: ActorsAndRelation[] | undefined =
                        newPersonNames &&
                        newPersonNames.map((p: PersonNameForCollectingEvent) => ({
                          actorUuid: p.actorUuid,
                          actorNameUuid: p.actorNameUuid,
                          roleId: p.roleId,
                          name: p.name,
                          orderNo: p.orderNo
                        }));

                      const newEventState = {
                        ...ps,
                        eventData: {
                          ...ps.eventData,
                          relatedActors: relatedActorsList
                        },
                        personState: newPersonState
                      };
                      return newEventState;
                    });
                  }
                }
              });
          }}
          onChangeFullName={(fieldName: string) => (value: string) => {
            this.setState((ps: CollectingEventState) => {
              const personSelectedMode =
                ps && ps.personState && ps.personState.personSelectedMode;

              let newPersonSelectedMode: PersonSelectedMode = 'NoPersonName';

              if (personSelectedMode === ('NoPersonName' || undefined)) {
                newPersonSelectedMode = 'PersonOrPersonName';
              } else if (personSelectedMode === 'PersonName') {
                newPersonSelectedMode = 'PersonOrPersonName';
              } else if (personSelectedMode === 'PersonOrPersonName') {
                newPersonSelectedMode = 'PersonOrPersonName';
              }

              const lastName =
                fieldName === 'lastName'
                  ? value
                  : ps.personState &&
                    ps.personState.editingPersonName &&
                    ps.personState.editingPersonName.lastName;
              const title =
                fieldName === 'title'
                  ? value
                  : ps.personState &&
                    ps.personState.editingPersonName &&
                    ps.personState.editingPersonName.title;
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : ps.personState &&
                    ps.personState.editingPersonName &&
                    ps.personState.editingPersonName.firstName;

              const name = `${lastName || ''}${title || firstName ? ', ' : ''}${title ||
                ''}${title ? ' ' : ''}${firstName}`;

              const disableOnChangeFullName =
                lastName || title || firstName ? true : false;

              let disableOnChangeOtherName = false;
              if (fieldName === 'name') {
                disableOnChangeOtherName = true;

                if (value === '') {
                  disableOnChangeOtherName = false;
                }
              }
              const newEditPersonName =
                ps.personState && ps.personState.editingPersonName
                  ? {
                      ...ps.personState.editingPersonName,
                      name: name,
                      editState: 'Editing',
                      [fieldName]: value
                    }
                  : {
                      name: ''
                    };
              const newPersonState: PersonState = ps.personState
                ? {
                    ...ps.personState,
                    editingPersonName: newEditPersonName,
                    editState: 'Editing',
                    disableOnChangeFullName: disableOnChangeFullName,
                    disableOnChangeOtherName: disableOnChangeOtherName,
                    personSelectedMode: newPersonSelectedMode
                  }
                : {
                    editState: 'Editing',
                    disableOnChangeFullName: disableOnChangeFullName,
                    disableOnChangeOtherName: disableOnChangeOtherName,
                    personSelectedMode: 'NoPersonName'
                  };

              const newEventState = {
                ...ps,
                personState: newPersonState
              };
              return newEventState;
            });
          }}
          onClickMoreOptions={(appSession: AppSession) => {
            if (
              this.state.personState &&
              this.state.personState.personName &&
              this.state.personState.personName.actorNameUuid
            ) {
              console.log('onClickMoreOptions : get Person');
              this.props.getPersonName &&
                this.props.getPersonName()({
                  id:
                    this.state &&
                    this.state.personState &&
                    this.state.personState.personName &&
                    this.state.personState.personName.actorNameUuid,
                  token: appSession.accessToken,
                  collectionId: appSession.collectionId,
                  callback: {
                    onComplete: (res: AjaxResponse) => {
                      this.setState((ps: CollectingEventState) => {
                        const newEditingPerson: InputPersonName = {
                          title: res.response.title || '',
                          firstName: res.response.firstName || '',
                          lastName: res.response.lastName || '',
                          name: res.response.name
                        };

                        const currStatus = ps.personState && ps.personState.showMoreInfo;
                        const newPersonState: PersonState = ps.personState
                          ? {
                              ...ps.personState,
                              editState: 'Editing',
                              editingPersonName: newEditingPerson,
                              showMoreInfo: !currStatus,
                              personSelectedMode: 'PersonName',
                              disableOnChangeOtherName: false,
                              disableOnChangeFullName: false
                            }
                          : {
                              editState: 'Editing',
                              editingPersonName: newEditingPerson,
                              showMoreInfo: false,
                              personSelectedMode: 'NoPersonName',
                              disableOnChangeOtherName: false,
                              disableOnChangeFullName: false
                            };
                        const newEventState = {
                          ...ps,
                          personState: newPersonState
                        };
                        return newEventState;
                      });
                    }
                  }
                });
            } else {
              console.log('onClickMoreOptions :  no Person selected');
              this.setState((cs: CollectingEventState) => {
                const currStatus = cs.personState && cs.personState.showMoreInfo;
                const newPersonSelectedMode = 'NoPersonName';

                const newPersonState: PersonState =
                  cs && cs.personState
                    ? {
                        ...cs.personState,
                        showMoreInfo: !currStatus,
                        personSelectedMode: newPersonSelectedMode
                      }
                    : {
                        showMoreInfo: false
                      };

                const newEventState = {
                  ...cs,
                  personState: newPersonState
                };
                return newEventState;
              });
            }
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
            heading="Event metadata"
            Head={ViewEventMetaDataComp}
            Body={EventMetadataComponent}
            readOnly={this.props.eventDataReadOnly}
            collapsed={this.props.eventDataCollapsed}
            showHead={this.state.eventData.eventUuid ? true : false}
          />
          <br />
          <CollapseComponent
            Head={PersonViewComponent}
            heading="Person"
            Body={PersonComponentBody}
            readOnly={this.props.personReadOnly}
            collapsed={this.props.personCollapsed}
            showHead={
              this.state.personState && this.state.personState.personNames ? true : false
            }
          />
          <br />
          <CollapseComponent
            heading="Place"
            Head={PlaceViewComponent}
            Body={PlaceBodyComponent}
            readOnly={this.props.placeReadOnly}
            collapsed={this.props.eventDataCollapsed}
            showHead={this.state.placeState.placeUuid ? true : false}
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
                this.addAndSaveCollecingEvent();
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
              nameEmpty={
                this.props.editEventMetaData && this.props.editEventMetaData.name === ''
                  ? true
                  : false
              }
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
