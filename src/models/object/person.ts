import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../types/ajax';
import { Star } from '../../types/common';

export type SynPerson = {
  actorUuid?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  name?: string;
  personAttribute?: {
    legalEntityType: string;
    url: string;
    externalIds: ExternalId[];
  };
  synonyms?: [
    {
      actorNameUuid: string;
      firstName: string;
      lastName: string;
      name: string;
      isDeleted: boolean;
    }
  ];
  collections?: [
    {
      museumId: number;
      collectionId: number;
    }
  ];
};

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
  actorUuid: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  isDeleted?: boolean;
  personAttribute?: PersonAttribute;
  collections: Collection[];
  synonyms?: PersonName[];
  personToMergeSyn: boolean;
  eventData?: EventData[];
}

export interface MergePerson {
  actorUuid: string;
}

export interface PersonName {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly title?: string;
  readonly name: string;
  readonly status?: string;
  readonly actorNameUuid?: string;
}

export interface InputPersonName {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly title?: string;
  readonly name: string;
  readonly status?: string;
  readonly actorNameUuid?: string;
  readonly concatPersonName?: string;
  readonly isDeleted?: boolean;
}

export interface OutputPersonName {
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  status?: string;
  actorNameUuid: string;
  defaultName?: string;
  isDeleted?: boolean;
}

/* export type PersonNameState = {
  name: string,
  firstName?: string,
  lastName?: string,
  title?: string,
  status?: string,
  actorNameUuid?: string,
  concatPersonName?: string,
  isDeleted?: boolean
}; */

export interface outPersonName {
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  defaultName?: string;
  isDeleted?: boolean;
  actorNameUuid?: string;
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

export type EventData = {
  eventUUID: string;
  eventType: string;
  dateFrom: Date;
  dateTo: Date;
  taxon?: {
    taxonUUID: string;
    genus: string;
    species: string;
  };
  place?: {
    placeUuid: string;
    admPlaceUuid: string;
    admPlace: {
      admPlaceUuid: string;
      name: string;
      type: string;
      path: string;
    };
  };
};

export const getPersonAttributesFromEvents: (personUUID: string) => Array<EventData> = (
  personUUID: string
) => [
  {
    eventUUID: '1',
    eventType: 'Collecting event',
    dateFrom: new Date('1954-09-21'),
    dateTo: new Date('1954-09-21'),
    place: {
      placeUuid: '1',
      admPlaceUuid: '1',
      admPlace: {
        admPlaceUuid: '1',
        name: 'Oslo',
        type: 'Kommune',
        path: 'Oslo fylke, Norge'
      }
    }
  },
  {
    eventUUID: '4',
    eventType: 'Collecting event',
    dateFrom: new Date('1945-09-21'),
    dateTo: new Date('1945-09-25'),
    place: {
      placeUuid: '3',
      admPlaceUuid: '2',
      admPlace: {
        admPlaceUuid: '2',
        name: 'Oslo',
        type: 'Kommune',
        path: 'Oslo fylke, Norge'
      }
    }
  },
  {
    eventUUID: '8',
    eventType: 'Collecting event',
    dateFrom: new Date('1933-09-21'),
    dateTo: new Date('1967-09-21'),
    place: {
      placeUuid: '7',
      admPlaceUuid: '8',
      admPlace: {
        admPlaceUuid: '8',
        name: 'Fredrikstad',
        type: 'Kommune',
        path: 'Østfold fylke, Norge'
      }
    }
  },

  {
    eventUUID: '348',
    eventType: 'Collecting event',
    dateFrom: new Date('1967-09-21'),
    dateTo: new Date('1999-09-21'),
    place: {
      placeUuid: '7',
      admPlaceUuid: '8',
      admPlace: {
        admPlaceUuid: '8',
        name: 'Fredrikstad',
        type: 'Kommune',
        path: 'Østfold fylke, Norge'
      }
    }
  },

  {
    eventUUID: '855',
    eventType: 'Collecting event',
    dateFrom: new Date('2010-09-21'),
    dateTo: new Date('2018-09-21'),
    place: {
      placeUuid: '7',
      admPlaceUuid: '8',
      admPlace: {
        admPlaceUuid: '8',
        name: 'Fredrikstad',
        type: 'Kommune',
        path: 'Østfold fylke, Norge'
      }
    }
  },

  {
    eventUUID: '8655',
    eventType: 'Collecting event',
    dateFrom: new Date('1999-09-21'),
    dateTo: new Date('2010-09-21'),
    place: {
      placeUuid: '7',
      admPlaceUuid: '8',
      admPlace: {
        admPlaceUuid: '8',
        name: 'Fredrikstad',
        type: 'Kommune',
        path: 'Østfold fylke, Norge'
      }
    }
  },
  {
    eventUUID: '33',
    eventType: 'Classifiation event',
    dateFrom: new Date('1963-09-21'),
    dateTo: new Date('1963-09-21'),
    taxon: {
      taxonUUID: '7',
      species: 'saxatilis',
      genus: 'Carex'
    }
  },
  {
    eventUUID: '123',
    eventType: 'Classifiation event',
    dateFrom: new Date('1974-09-21'),
    dateTo: new Date('1974-09-21'),
    taxon: {
      taxonUUID: '9',
      species: 'alpina',
      genus: 'Poa'
    }
  },
  {
    eventUUID: '1237',
    eventType: 'Classifiation event',
    dateFrom: new Date('1963-09-21'),
    dateTo: new Date('1963-09-21'),
    taxon: {
      taxonUUID: '11',
      species: 'flava',
      genus: 'Carex'
    }
  }
];

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
  const URL = Config.api.persons.searchPersonBySynonymOrName(name);
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

export const addPersonName: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    token: string;
    data: any;
    callback?: Callback<Star>;
  }
) => Observable<InputPersonName> = (ajaxPost = simplePost) => ({
  data,
  token,
  callback
}) => {
  const URL = Config.api.persons.addPersonNameUrl;
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};

export const getPersonName: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: string;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<InputPersonName> = (ajaxGet = simpleGet) => ({ id, token, callback }) => {
  const URL = Config.api.persons.getPersonNameUrl(id);
  return ajaxGet(URL, token, callback).map(({ response }) => response);
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

export const mergePerson: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    id: string;
    token: string;
    data: any;
    callback?: Callback<Star>;
  }
) => Observable<string> = (ajaxPost = simplePost) => ({ id, data, token, callback }) => {
  const URL = Config.api.persons.mergeUrl(id)(data.actorUuid);
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};
