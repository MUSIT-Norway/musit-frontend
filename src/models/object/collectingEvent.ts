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
import { OutPlace } from './place';

export type Uuid = string;
export type EventUuid = Uuid;
export type RoleId = number;
export type PersonUuid = Uuid;
export type PersonNameUuid = Uuid;

export type ActorsAndRelation = {
  actorUuid?: PersonUuid;
  roleId?: RoleId;
  roleText?: string;
  name?: string;
  personNameUuid?: PersonNameUuid;
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
  eventType: number;
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
}

export interface OutputCollectingEvent extends OutputEvent {
  name: string;
  methodId?: number;
  method?: string;
  methodDescription?: string;
}

export class CollectingEvent implements InputCollectingEvent {
  name: string;
  methodId?: number;
  method?: string;
  methodDescription?: string;
  eventUuid: EventUuid;
  eventType: number;
  museumId?: number;
  collectionId?: number;
  note?: string;
  partOf?: EventUuid;
  createdBy?: PersonUuid; // Person;
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
    methodId?: number,
    method?: string,
    methodDescription?: string,
    museumId?: number,
    collectionId?: number,
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
    this.name = name;
    this.eventUuid = eventUuid;
    this.eventType = eventType;
    (this.methodId = methodId),
      (this.method = method),
      (this.methodDescription = methodDescription),
      (this.museumId = museumId);
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
) => Observable<InputCollectingEvent> = (ajaxGet = simpleGet) => ({
  id,
  token,
  callback
}) => {
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
    data: InputCollectingEvent;
    callback?: Callback<Star>;
  }
) => Observable<InputCollectingEvent> = (ajaxPost = simplePost) => ({
  data,
  token,
  callback
}) => {
  const URL = Config.api.collectingEvent.addEventUrl;
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
