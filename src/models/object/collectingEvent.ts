import {
  Collection,
  SynonymType,
  ExternalId
} from '../../modules/object/person/PersonComponent';
import { Observable } from 'rxjs';
import { simplePost, simpleGet } from '../../shared/RxAjax';
import { Callback, AjaxPost, AjaxGet } from '../../types/ajax';
import { Star } from '../../types/common';
import Config from '../../config';
import { OutPlace, InputPlaceWithUuid } from './place';

export type Uuid = string;
export type EventUuid = Uuid;
export type RoleId = number;
export type PersonUuid = Uuid;
export type PersonNameUuid = Uuid;

export type ActorsAndRelation = {
  actorUuid?: PersonUuid;
  roleId: RoleId;
  roleText?: string;
  name: string;
  personNameUuid: PersonNameUuid;
};

export interface InputActorAndRelation {
  actorUuid?: PersonUuid;
  roleId: RoleId;
  name: string;
  personNameUuid: PersonNameUuid;
}
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
/* 
export interface InputEvent {
  eventUuid?: EventUuid;
  eventType: number;
  museumId?: number;
  collectionId?: number;
  note?: string;
  partOf?: EventUuid;
  createdBy?: PersonUuid; //Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
} */

export interface InputEvent {
  eventUuid?: EventUuid;
  eventTypeId: number;
  museumId?: number;
  collectionId?: number;
  //note?: string;
  partOf?: EventUuid;
  relatedActors?: InputActorAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
  attributes?: CollectingEventAttributes;
  revisionOf?: EventUuid;
}

export type EventAttributes = object; //We know nothing of the attributes on the generic level!

export interface CollectingEventAttributes extends EventAttributes {
  name: string;
  methodId?: number;
  method?: string;
  note?: string;
}

export interface InputCollectingEvent extends InputEvent {
  name: string;
  methodId?: number;
  method?: string;
  methodDescription?: string;
}

export interface OutActorAndRelation {
  actorUuid?: PersonUuid;
  roleId: RoleId;
  roleText: string;
  name: string;
  personNameUuid: PersonNameUuid;
}

export interface OutputEvent {
  eventUuid: EventUuid;
  eventTypeId: number;
  museumId: number;
  collectionId: number;
  note?: string;
  partOf?: EventUuid;
  createdBy: PersonUuid;
  createdDate: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  place?: OutPlace;
  attributes?: CollectingEventAttributes;
}

export interface OutPlaceAndRelation {
  placeUuid: Uuid;
  roleId: RoleId;
  roleText: string;
}

export interface InputPlaceAndRelation {
  placeUuid: Uuid;
  roleId: RoleId;
}

export class InputPlaceAndRelation implements InputPlaceAndRelation {
  placeUuid: Uuid;
  roleId: RoleId;
  constructor(placeUuid: Uuid, roleId: RoleId) {
    this.placeUuid = placeUuid;
    this.roleId = roleId;
  }
}

export interface InputDateRevision {
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
}

export class InputDateRevision implements InputDateRevision {
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  constructor(eventDateFrom?: string, eventDateTo?: string, eventDateVerbatim?: string) {
    this.eventDateFrom = eventDateFrom;
    this.eventDateTo = eventDateTo;
    this.eventDateVerbatim = eventDateVerbatim;
  }
}

export class CollectingEvent implements InputEvent {
  methodId?: number;
  method?: string;
  methodDescription?: string;
  eventUuid: EventUuid;
  eventTypeId: number;
  museumId: number;
  collectionId: number;
  note?: string;
  partOf?: EventUuid;
  createdBy?: PersonUuid; // Person;
  createdDate?: string;
  relatedActors?: ActorsAndRelation[];
  eventDateFrom?: string;
  eventDateTo?: string;
  eventDateVerbatim?: string;
  placeUuid?: Uuid;
  attributes?: CollectingEventAttributes;

  constructor(
    eventUuid: EventUuid,
    eventTypeId: number,
    museumId: number,
    collectionId: number,
    name: string,
    methodId?: number,
    method?: string,
    methodDescription?: string,
    note?: string,
    partOf?: EventUuid,
    createdBy?: PersonUuid, //Person,
    createdDate?: string,
    relatedActors?: ActorsAndRelation[],
    eventDateFrom?: string,
    eventDateTo?: string,
    eventDateVerbatim?: string,
    placeUuid?: Uuid
  ) {
    this.eventUuid = eventUuid;
    this.eventTypeId = eventTypeId;
    this.methodId = methodId;
    this.method = method;
    this.methodDescription = methodDescription;
    this.museumId = museumId;
    this.collectionId = collectionId;
    this.note = note;
    this.partOf = partOf;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.relatedActors = relatedActors;
    this.eventDateFrom = eventDateFrom;
    this.eventDateTo = eventDateTo;
    this.eventDateVerbatim = eventDateVerbatim;
    this.placeUuid = placeUuid;
    this.attributes = {
      methodId: methodId,
      method: method,
      note: note,
      name: name
    };
  }
}
export const getCollectingEvent: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: string;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<OutputEvent> = (ajaxGet = simpleGet) => ({ id, token, callback }) => {
  const URL = Config.api.collectingEvent.getEvent(id);
  console.log('URL', URL);
  return ajaxGet(URL, token, callback)
    .map(({ response }) => response)
    .do(response => console.log('RESPONSE ::::: ', response));
};

export const addCollectingEvent: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    token: string;
    data: InputEvent;
    callback?: Callback<Star>;
  }
) => Observable<InputEvent> = (ajaxPost = simplePost) => ({ data, token, callback }) => {
  const URL = Config.api.collectingEvent.addEventUrl;
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};

export const editEventDateRevision: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    id: string;
    token: string;
    data: InputDateRevision;
    callback?: Callback<Star>;
  }
) => Observable<InputCollectingEvent> = (ajaxPost = simplePost) => ({
  id,
  data,
  token,
  callback
}) => {
  const URL = Config.api.collectingEvent.editEvent.eventDateRevision(id);
  return ajaxPost(URL, data, token, callback)
    .do(r => console.log('DO', r, callback))
    .map(({ response }) => response);
};

export const editEventAttributesRevision: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    id: string;
    token: string;
    data: CollectingEventAttributes;
    callback?: Callback<Star>;
  }
) => Observable<CollectingEventAttributes> = (ajaxPost = simplePost) => ({
  id,
  data,
  token,
  callback
}) => {
  const URL = Config.api.collectingEvent.editEvent.eventAttributesRevision(id);
  return ajaxPost(URL, data, token, callback)
    .do(r => console.log('DO', r, callback))
    .map(({ response }) => response);
};

export const editEventPlaceRevision: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    id: string;
    token: string;
    data: InputPlaceWithUuid & { methodId?: number };
    callback?: Callback<Star>;
  }
) => Observable<[Observable<InputPlaceWithUuid>, Observable<InputCollectingEvent>]> = (
  ajaxPost = simplePost
) => ({ id, data, token, callback }) => {
  const placeURL = Config.api.collectingEvent.editEvent.eventPlaceRevision(id);
  /*
  //Comment: Anuradha - No need to update eventMeta data since we only changing the place date
   const eventURL = Config.api.collectingEvent.editEvent.eventAttributesRevision(id);
   return Observable.forkJoin(
    ajaxPost(placeURL, data, token, callback).map(({ response }) => response),
    ajaxPost(eventURL, data, token, callback).map(({ response }) => response)
  ); 
  */
  return ajaxPost(placeURL, data, token, callback).map(({ response }) => response);
};

export const editEventPersonRevision: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    id: string;
    token: string;
    data: ActorsAndRelation[];
    callback?: Callback<Star>;
  }
) => Observable<InputActorAndRelation[]> = (ajaxPost = simplePost) => ({
  id,
  data,
  token,
  callback
}) => {
  const URL = Config.api.collectingEvent.editEvent.eventPersonRevision(id);
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};

export const getCollectingEventMethods: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<Star> = (ajaxGet = simpleGet) => ({ token, callback }) => {
  const URL = Config.api.collectingEvent.getCollectingEventMethods;
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};
