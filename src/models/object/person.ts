import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../types/ajax';
import { Star } from '../../types/common';
import { collections } from '../../modules/object/person/mockdata/data';

/* const collections = [
  {
    collectionId: 1,
    collectionUUID: '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
    collectionName: 'Arkeologi'
  },
  {
    collectionId: 2,
    collectionUUID: '88b35138-24b5-4e62-bae4-de80fae7df82',
    collectionName: 'Etnografi'
  },
  {
    collectionId: 3,
    collectionUUID: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
    collectionName: 'Numismatikk'
  },
  {
    collectionId: 4,
    collectionUUID: 'fcb4c598-8b05-4095-ac00-ce66247be38a',
    collectionName: 'Lav'
  },
  {
    collectionId: 5,
    collectionUUID: 'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
    collectionName: 'Mose'
  },
  {
    collectionId: 6,
    collectionUUID: '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
    collectionName: 'Sopp'
  },
  {
    collectionId: 7,
    collectionUUID: '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
    collectionName: 'Alger'
  },
  {
    collectionId: 8,
    collectionUUID: '7352794d-4973-447b-b84e-2635cafe910a',
    collectionName: 'Karplanter'
  },
  {
    collectionId: 9,
    collectionUUID: 'ba3d4d30-810b-4c07-81b3-37751f2196f0',
    collectionName: 'Entomologi'
  },
  {
    collectionId: 10,
    collectionUUID: 'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
    collectionName: 'Marine evertebrater'
  }
];

const museum = [
  { museumId: 1, museumName: 'Arkeologisk Museum', abbreviation: 'AM' },
  { museumId: 2, museumName: 'Bergen Universitetsmuseum', abbreviation: 'UM' },
  { museumId: 3, museumName: 'Kulturhistorisk Museum', abbreviation: 'KHM' },
  { museumId: 4, museumName: 'Naturhistorisk Museum', abbreviation: 'NHM' },
  { museumId: 5, museumName: 'NTNU Vitenskapsmuseet', abbreviation: 'VM' },
  { museumId: 6, museumName: 'Tromsø Museum', abbreviation: 'TMU' },
  { museumId: 7, museumName: 'Kristiansand Naturmuseum', abbreviation: 'KMN' }
];

const museumCollection = [
  { museumId: 1, collectionId: 1 },
  { museumId: 1, collectionId: 3 },
  { museumId: 2, collectionId: 1 },
  { museumId: 2, collectionId: 2 },
  { museumId: 2, collectionId: 3 },
  { museumId: 2, collectionId: 4 },
  { museumId: 2, collectionId: 5 },
  { museumId: 2, collectionId: 6 },
  { museumId: 2, collectionId: 7 },
  { museumId: 2, collectionId: 8 },
  { museumId: 2, collectionId: 9 },
  { museumId: 2, collectionId: 10 },
  { museumId: 3, collectionId: 1 },
  { museumId: 3, collectionId: 2 },
  { museumId: 3, collectionId: 3 },
  { museumId: 4, collectionId: 4 },
  { museumId: 4, collectionId: 5 },
  { museumId: 4, collectionId: 6 },
  { museumId: 4, collectionId: 7 },
  { museumId: 4, collectionId: 8 },
  { museumId: 4, collectionId: 9 },
  { museumId: 4, collectionId: 10 },
  { museumId: 5, collectionId: 1 },
  { museumId: 5, collectionId: 4 },
  { museumId: 5, collectionId: 5 },
  { museumId: 5, collectionId: 6 },
  { museumId: 5, collectionId: 7 },
  { museumId: 5, collectionId: 8 },
  { museumId: 5, collectionId: 9 },
  { museumId: 5, collectionId: 10 },
  { museumId: 6, collectionId: 1 },
  { museumId: 6, collectionId: 2 },
  { museumId: 6, collectionId: 3 },
  { museumId: 6, collectionId: 4 },
  { museumId: 6, collectionId: 5 },
  { museumId: 6, collectionId: 6 },
  { museumId: 6, collectionId: 7 },
  { museumId: 6, collectionId: 8 },
  { museumId: 6, collectionId: 8 },
  { museumId: 6, collectionId: 10 },
  { museumId: 7, collectionId: 5 },
  { museumId: 7, collectionId: 8 }
]; */

export interface InputPerson {
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  personAttribute?: PersonAttribute;
  collections: Collection[];
  synonyms?: PersonName[];
}

export interface OutputPerson {
  personUuid: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  isDeleted?: boolean;
  personAttribute?: PersonAttribute;
  collections: Collection[];
  synonyms?: PersonName[];
}

export interface PersonName {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly title?: string;
  readonly name: string;
  readonly status?: string;
  readonly personNameUuid?: string;
}

export interface Collection {
  museumId: number;
  collectionId: number;
}

export interface Database {
  databaseName: string;
  databaseURL: string;
}

export interface DatabaseConnection {
  database: Database;
  id: string;
}

export interface PersonAttribute {
  legalEntityType: string;
  displayName?: string;
  bornDate?: string;
  deathDate?: string;
  verbatimDate?: string;
  url?: string;
  externalIds?: ExternalId[];
}

export interface ExternalId {
  database?: string;
  uuid?: string;
}

export class PersonAttribute {
  legalEntityType: string;
  displayName?: string;
  bornDate?: string;
  deathDate?: string;
  verbatimDate?: string;
  url?: string;
  externalIds?: ExternalId[];
  constructor(
    legalEntityType: string,
    displayName?: string,
    bornDate?: string,
    deathDate?: string,
    verbatimDate?: string,
    externalIds?: ExternalId[],
    url?: string
  ) {
    this.legalEntityType = legalEntityType;
    this.displayName = displayName;
    this.bornDate = bornDate;
    this.deathDate = deathDate;
    this.verbatimDate = verbatimDate;
    this.externalIds = externalIds;
    this.url = url;
  }
}

export class Person implements InputPerson {
  name: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  personAttribute?: PersonAttribute;
  collections: Collection[];
  synonyms?: PersonName[];

  constructor(
    name: string,
    collections: Collection[],
    legalEntityType: string,
    title?: string,
    firstName?: string,
    lastName?: string,
    displayName?: string,
    bornDate?: string,
    deathDate?: string,
    verbatimDate?: string,
    url?: string,
    synonyms?: PersonName[],
    externalIds?: ExternalId[]
  ) {
    this.name = name;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.personAttribute = new PersonAttribute(
      legalEntityType,
      displayName,
      bornDate,
      deathDate,
      verbatimDate,
      externalIds,
      url
    );
    this.synonyms = synonyms;
    this.collections = collections;
  }
}

export const getPerson: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: string;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<InputPerson> = (ajaxGet = simpleGet) => ({ id, token, callback }) => {
  const URL = Config.api.persons.getUrl(id);
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const searchPersonName: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    name: string;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<OutputPerson[]> = (ajaxGet = simpleGet) => ({
  name,
  token,
  callback
}) => {
  const URL = Config.api.persons.searchPersonNameURL(name);
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const addPerson: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    token: string;
    data: any;
    callback?: Callback<Star>;
  }
) => Observable<InputPerson> = (ajaxPost = simplePost) => ({ data, token, callback }) => {
  const URL = Config.api.persons.addUrl;
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};
export const editPerson: (
  ajaxPut: AjaxPut<Star>
) => (
  props: {
    id: string;
    token: string;
    data: any;
    callback?: Callback<Star>;
  }
) => Observable<InputPerson> = (ajaxPut = simplePut) => ({
  id,
  data,
  token,
  callback
}) => {
  const URL = Config.api.persons.editUrl(id);
  return ajaxPut(URL, data, token, callback)
    .do(r => console.log('DO', r, callback))
    .map(({ response }) => response);
};
