import { simpleGet, simplePost, simplePut } from '../../../shared/RxAjax';
import {
  getPerson,
  InputPerson,
  OutputPerson,
  addPerson,
  editPerson,
  searchPersonName,
  mergePerson,
  //MergePerson,
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
};

export type GetPersonProps = CommonParams & { id: string };
export type AddPersonProps = CommonParams & { data: PersonState };
export type EditPersonProps = CommonParams & {
  data: PersonState;
  id: string;
};
export type MergePersonProps = CommonParams & {
  data: any;
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

const mergePersonData = (ajaxPost: AjaxPost<Star>) => (props: MergePersonProps) =>
  Observable.of(props).flatMap(props =>
    mergePerson(ajaxPost)({
      id: props.id,
      data: props.data,
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

export const mergePerson$: Subject<
  MergePersonProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('mergePerson$');

type Actions = {
  getPerson$: Subject<GetPersonProps>;
  addPerson$: Subject<AddPersonProps>;
  editPerson$: Subject<EditPersonProps>;
  getPersonsFromPersonName$: Subject<GetPersonsFromPersonNameProps>;
  mergePerson$: Subject<MergePersonProps>;
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
      .map((newPerson: OutputPerson) => (state: PersonStoreState) => ({
        ...state,
        person: newPerson,
        localState: toFrontend(newPerson)
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
      .map((person: InputPerson) => (state: PersonStoreState) => ({ ...state, person })),
    actions.mergePerson$
      .switchMap(mergePersonData(ajaxPost))
      .map(() => (state: PersonStoreState) => ({ ...state }))
  );
};
export const store$ = (
  actions$: Actions = {
    getPerson$,
    addPerson$,
    editPerson$,
    getPersonsFromPersonName$,
    mergePerson$
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
