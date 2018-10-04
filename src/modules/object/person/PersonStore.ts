import { simpleGet, simplePost, simplePut } from '../../../shared/RxAjax';
import {
  getPerson,
  InputPerson,
  OutputPerson,
  addPerson,
  editPerson,
  searchPersonName,
  Person
} from '../../../models/object/person';
import { Observable, Subject } from 'rxjs';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../../types/ajax';
import { createStore } from 'react-rxjs';
import { KEEP_ALIVE } from '../../../stores/constants';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { Star } from '../../../types/common';
import { PersonState, toFrontend, SynonymType } from './PersonComponent';

export type PersonStoreState = {
  localState?: PersonState;
  person?: InputPerson | OutputPerson;
  personList?: Array<OutputPerson>;
};

export const initialPersonState = {
  personList: []
};

export type CommonParams = {
  collectionId: string;
  token: string;
  callback?: Callback<Star>;
};

export const toBackend: ((p: PersonState) => InputPerson) = (p: PersonState) => {
  const changedSynonymsFiltered = p.synonyms
    ? p.synonyms.filter(e => e.status !== 'UNCHANGED')
    : undefined;
  const changedSynonyms =
    changedSynonymsFiltered && changedSynonymsFiltered.length > 0
      ? changedSynonymsFiltered
      : undefined;

  const c = new Person(
    p.fullName.nameString,
    p.collections,
    p.legalEntityType,
    p.fullName.title,
    p.fullName.firstName,
    p.fullName.lastName,
    p.fullName.nameString,
    p.bornDate,
    p.deathDate,
    p.verbatimDate,
    p.url,
    changedSynonyms
      ? changedSynonyms.map((p: SynonymType) => ({
          personNameUuid: p.status === 'DEL' ? p.personNameUuid : '',
          firstName: p.firstName,
          lastName: p.lastName,
          title: p.title,
          name: p.nameString,
          isDeleted: p.status === 'DEL' ? true : false
        }))
      : undefined,
    p.externalIds ? p.externalIds : []
  );
  console.log('to backend ', c);
  return c;

  //return '{"firstName": "Karstennyyyn","lastName": "HårsakerNesten","title": "herr","name": "HårsakerNesten, herr Karstennn","collections": [{ "museum_id": 5, "collection_id": 10 }],"personAttribute": {"legalEntityType": "person",    "displayName": "Karstenn HårsakerNesten",    "bornDate": "10.09.1967",    "URL": "http://muligensEnUrl"}, "synonyms": [      {        "firstName": "Kristian",        "lastName": "Hårsårssaker",        "name": "K. Hårårssakerrr",        "title": "Herr"      },{        "firstName": "KK",      "lastName": "HårsårsNesten","name": "Hårårssaker, K"      },     {"firstName": "Kris",        "lastName": "HårsNest",        "name": "HårsNest,Kris"      }    ]}';
};

export type GetPersonProps = CommonParams & { id: string };
export type AddPersonProps = CommonParams & { data: PersonState };
export type EditPersonProps = CommonParams & {
  data: PersonState;
  id: string;
};

export type GetPersonsFromPersonNameProps = CommonParams & { name: string };

const getPersonById = (ajaxGet: AjaxGet<Star>) => (props: GetPersonProps) =>
  Observable.of(props).flatMap(props =>
    getPerson(ajaxGet)({ id: props.id, token: props.token, callback: props.callback })
  );

const addPersonData = (ajaxPost: AjaxPost<Star>) => (props: AddPersonProps) =>
  Observable.of(props).flatMap(props =>
    addPerson(ajaxPost)({
      data: toBackend(props.data),
      token: props.token,
      callback: props.callback
    })
  );
const editPersonData = (ajaxPut: AjaxPut<Star>) => (props: EditPersonProps) =>
  Observable.of(props).flatMap(props =>
    editPerson(ajaxPut)({
      id: props.id,
      data: toBackend(props.data),
      token: props.token,
      callback: props.callback
    })
  );

const searchPersonsFromName = (ajaxGet: AjaxGet<Star>) => (
  props: GetPersonsFromPersonNameProps
) =>
  Observable.of(props).flatMap(props =>
    searchPersonName(ajaxGet)({
      name: props.name,
      token: props.token,
      callback: props.callback
    })
  );

export const getPerson$: Subject<
  GetPersonProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getPerson$');

export const getPersonsFromPersonName$: Subject<
  GetPersonsFromPersonNameProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getPersonFromPersonName$');

export const addPerson$: Subject<
  AddPersonProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addPerson$');

export const editPerson$: Subject<
  EditPersonProps & {
    ajaxPut: AjaxPut<Star>;
  }
> = createAction('editPerson$');

type Actions = {
  getPerson$: Subject<GetPersonProps>;
  addPerson$: Subject<AddPersonProps>;
  editPerson$: Subject<EditPersonProps>;
  getPersonsFromPersonName$: Subject<GetPersonsFromPersonNameProps>;
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  ajaxPut: AjaxPut<Star>
): Observable<Reducer<PersonStoreState>> => {
  return Observable.merge(
    actions.getPerson$
      .switchMap(getPersonById(ajaxGet))
      .map((person: OutputPerson) => (state: PersonStoreState) => ({
        ...state,
        person,
        localState: toFrontend(person)
      })),
    actions.getPersonsFromPersonName$
      .switchMap(searchPersonsFromName(ajaxGet))
      .map((personList: Array<OutputPerson>) => (state: PersonStoreState) => ({
        ...state,
        personList
      })),

    actions.addPerson$
      .switchMap(addPersonData(ajaxPost))
      .map((person: InputPerson) => (state: PersonStoreState) => ({ ...state, person })),
    actions.editPerson$
      .switchMap(editPersonData(ajaxPut))
      .map((person: InputPerson) => (state: PersonStoreState) => ({ ...state, person }))
  );
};
export const store$ = (
  actions$: Actions = {
    getPerson$,
    addPerson$,
    editPerson$,
    getPersonsFromPersonName$
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost,
  ajaxPut: AjaxPost<Star> = simplePut
) => {
  return createStore(
    'personStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut),
    initialPersonState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;
