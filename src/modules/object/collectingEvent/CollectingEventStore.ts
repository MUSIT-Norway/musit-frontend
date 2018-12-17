import {
  getCollectingEvent,
  addCollectingEvent,
  CollectingEvent,
  InputCollectingEvent,
  OutputEvent,
  editEventDateRevision,
  editEventPlaceRevision,
  editEventPersonRevision,
  editEventAttributesRevision,
  CollectingEventAttributes,
  InputDateRevision,
  ActorsAndRelation,
  InputEvent
} from '../../../models/object/collectingEvent';
import {
  addPlace,
  InputPlace,
  inputPlace,
  InputPlaceWithUuid
} from '../../../models/object/place';
import { CollectingEventState } from './CollectingEventComponent';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../../types/ajax';
import { Star } from '../../../types/common';
import { Observable, Subject } from 'rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { simpleGet, simplePost, simplePut } from '../../../shared/RxAjax';
import { KEEP_ALIVE } from '../../../stores/constants';
import { createStore } from 'react-rxjs';
import { toFrontend } from '../collectingEvent/CollectingEventComponent';
import { AdmPlace } from '../placeStateless/PlaceComponent';
import { PersonState } from './PersonComponent';
import {
  InputPersonName,
  getPersonName,
  addPersonName
} from '../../../models/object/person';

export type CollectingEventStoreState = {
  localState?: CollectingEventState;
  collectingEvent?: InputEvent;
  collectingEventList?: Array<InputEvent>;
  personState?: PersonState;
};
export type CollectingEventMethod = {
  methodId: number;
  method: string;
};
export type PredefinedCollectingEventValues = {
  datums: { datum: string }[] | null;
  coordinateTypes: { type_text: string }[] | null;
  coordinateSources: { source: string }[] | null;
  geometryTypes: { geometry: string }[] | null;
  collectingMethods: CollectingEventMethod[] | null;
  countries: AdmPlace[];
};
export const initialCollectingEventState = {
  collectingEvent: {
    eventTypeId: 6,
    museumId: 99,
    collectionId: 0
  }
};
export type CommonParams = {
  collectionId: string;
  token: string;
  callback?: Callback<Star>;
};

export type GetCollectingEventProps = CommonParams & { id: string };
export type AddCollectingEventProps = CommonParams & { data: CollectingEventState };
export type EditCollectingEventProps = CommonParams & {
  data: InputEvent;
  id: string;
};

export type EditEventAttributesProps = CommonParams & {
  data: CollectingEventAttributes;
  id: string;
};
export type EditPlaceProps = CommonParams & {
  id: string;
  data: InputPlaceWithUuid & { methodId?: number };
};

export type AddPersonNameProps = CommonParams & { data: InputPersonName };
export type GetPersonNameProps = CommonParams & { id: string };

export type EditPersonEventProps = CommonParams & {
  id: string;
  data: ActorsAndRelation[];
};

export const toBackend: ((p: CollectingEventState) => InputEvent) = (
  p: CollectingEventState
) => {
  const c = new CollectingEvent(
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
  console.log('to backend ', c);
  return c;
};

export const toBackendPersonName: ((p: InputPersonName) => InputPersonName) = (
  p: InputPersonName
) => {
  return p;
};

const getCollectingEventData = (ajaxGet: AjaxGet<Star>) => (
  props: GetCollectingEventProps
) =>
  Observable.of(props).flatMap(props =>
    getCollectingEvent(ajaxGet)({
      id: props.id,
      token: props.token,
      callback: props.callback
    })
  );

const addCollectingEventData = (ajaxPost: AjaxPost<Star>) => (
  props: AddCollectingEventProps
) => {
  const ip: InputPlace = new inputPlace(
    undefined,
    props.data.placeState.admPlace
      ? props.data.placeState.admPlace.admPlaceUuid
      : undefined,
    props.data.placeState.editingInputCoordinate,
    props.data.placeState.editingCoordinateAttribute,
    props.data.placeState.editingAttributes
  );
  console.log(
    'Place data: ',
    ip,
    'Editing coordinate attribute',
    props.data.placeState.editingCoordinateAttribute
  );
  return Observable.of(props).flatMap(props =>
    addPlace(ajaxPost)({
      data: ip,
      token: props.token
    }).flatMap(({ placeUuid }) =>
      addCollectingEvent(ajaxPost)({
        data: { ...toBackend(props.data), placeUuid: placeUuid },
        token: props.token,
        callback: props.callback
      })
    )
  );
};

const editEventMetaData = (ajaxPost: AjaxPost<Star>) => (
  props: EditCollectingEventProps
) => {
  const inputDateRevision = new InputDateRevision(
    props.data && props.data.eventDateFrom ? props.data.eventDateFrom : undefined,
    props.data && props.data.eventDateTo ? props.data.eventDateTo : undefined,
    props.data && props.data.eventDateVerbatim ? props.data.eventDateVerbatim : undefined
  );
  const inputEventAttributes: CollectingEventAttributes | undefined = props.data
    .attributes
    ? {
        name: props.data.attributes.name,
        method: props.data.attributes.method,
        methodId: props.data.attributes.methodId,
        note: props.data.attributes && props.data.attributes.note
      }
    : undefined;
  return Observable.forkJoin(
    editEventDateRevision(ajaxPost)({
      id: props.id,
      data: inputDateRevision,
      token: props.token
    }),
    inputEventAttributes
      ? editEventAttributesRevision(ajaxPost)({
          id: props.id,
          data: inputEventAttributes,
          token: props.token
        })
      : Observable.empty()
  )
    .last()
    .toPromise()
    .then(
      onComplete =>
        props.callback &&
        props.callback.onComplete &&
        props.callback.onComplete(onComplete)
    );
};

const editEventDateRevisionData = (ajaxPost: AjaxPost<Star>) => (
  props: EditCollectingEventProps
) =>
  Observable.of(props).flatMap(props => {
    const inputDateRevision = new InputDateRevision(
      props.data && props.data.eventDateFrom ? props.data.eventDateFrom : undefined,
      props.data && props.data.eventDateTo ? props.data.eventDateTo : undefined,
      props.data && props.data.eventDateVerbatim
        ? props.data.eventDateVerbatim
        : undefined
    );

    return editEventDateRevision(ajaxPost)({
      id: props.id,
      data: inputDateRevision,
      token: props.token,
      callback: props.callback
    });
  });

const editEventAttributesRevisionData = (ajaxPost: AjaxPost<Star>) => (
  props: EditEventAttributesProps
) =>
  Observable.of(props).flatMap(props => {
    return editEventAttributesRevision(ajaxPost)({
      id: props.id,
      data: props.data,
      token: props.token,
      callback: props.callback
    });
  });

const editEventPlaceRevisionData = (ajaxPost: AjaxPost<Star>) => (
  props: EditPlaceProps
) =>
  Observable.of(props).flatMap(props => {
    return editEventPlaceRevision(ajaxPost)({
      id: props.id,
      data: props.data,
      token: props.token,
      callback: props.callback
    });
  });

const editPersonRevisionData = (ajaxPost: AjaxPost<Star>) => (
  props: EditPersonEventProps
) =>
  Observable.of(props).flatMap(props => {
    return editEventPersonRevision(ajaxPost)({
      id: props.id,
      data: props.data,
      token: props.token,
      callback: props.callback
    });
  });

const addPersonNameData = (ajaxGet: AjaxGet<Star>, ajaxPost: AjaxPost<Star>) => (
  props: AddPersonNameProps
) =>
  Observable.of(props)
    .flatMap(props =>
      addPersonName(ajaxPost)({
        data: toBackendPersonName(props.data),
        token: props.token /* ,
        callback: props.callback */
      })
    )
    .do(res => console.log('((((=====)))) ', res.personNameUuid))
    .flatMap(res => {
      return getPersonNameFromUuid(ajaxGet)({
        id: res.personNameUuid || '',
        collectionId: props.collectionId,
        token: props.token,
        callback: props.callback
      });
    })
    .do(r => console.log('Return from get personNameFromUuid ', r));

const getPersonNameFromUuid = (ajaxGet: AjaxGet<Star>) => (props: GetPersonNameProps) =>
  Observable.of(props).flatMap(props =>
    getPersonName(ajaxGet)({ id: props.id, token: props.token, callback: props.callback })
  );
export const addCollectingEvent$: Subject<
  AddCollectingEventProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addCollectingEvent$');

export const setDisabledState$: Subject<{
  fieldName: string;
  value: boolean;
}> = createAction('setDisabledState$');

export const setDraftState$: Subject<{
  subState?: string;
  fieldName: string;
  value: boolean;
}> = createAction('setDraftState$');

export const getCollectingEvent$: Subject<
  GetCollectingEventProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getCollectingEvent$');

export const editEventDateRevision$: Subject<
  EditCollectingEventProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('editEventDateRevision$');

export const editEventPlaceRevision$: Subject<
  EditPlaceProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('editEventPlaceRevision$');

export const editEventPersonRevision$: Subject<
  EditPersonEventProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('editEventPlaceRevision$');

export const editEventAttributesRevision$: Subject<
  EditEventAttributesProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('editEventAttributesRevision$');
export const editEventMetaData$: Subject<
  EditCollectingEventProps & {
    ajaxPost: AjaxPost<Star>;
  }
> = createAction('editEventMetaData$');

export const addPersonName$: Subject<
  AddPersonNameProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addPersonName$');

export const getPersonName$: Subject<
  GetPersonNameProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getPersonName$');

type Actions = {
  getCollectingEvent$: Subject<GetCollectingEventProps>;
  addCollectingEvent$: Subject<AddCollectingEventProps>;
  editEventPersonRevision$: Subject<EditPersonEventProps>;
  editEventDateRevision$: Subject<EditCollectingEventProps>;
  editEventAttributesRevision$: Subject<EditEventAttributesProps>;
  editEventPlaceRevision$: Subject<EditPlaceProps>;
  editEventMetaData$: Subject<EditCollectingEventProps>;
  setDisabledState$: Subject<{ fieldName: string; value: boolean }>;
  setDraftState$: Subject<{ subState?: string; fieldName: string; value: boolean }>;
  addPersonName$: Subject<AddPersonNameProps>;
  getPersonName$: Subject<GetPersonNameProps>;
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  ajaxPut: AjaxPut<Star>
): Observable<Reducer<CollectingEventStoreState>> => {
  return Observable.merge(
    actions.setDisabledState$.map(
      (v: { fieldName: string; value: boolean }) => (
        state: CollectingEventStoreState
      ) => ({
        ...state,
        [v.fieldName]: v.value
      })
    ),
    actions.setDraftState$.map(
      (v: { subState?: string; fieldName: string; value: boolean }) => (
        state: CollectingEventStoreState
      ) => {
        const collectingEvent = state.collectingEvent;
        if (v.subState) {
          const newSubState = collectingEvent
            ? { ...collectingEvent[v.subState], [v.fieldName]: v.value }
            : { [v.fieldName]: v.value };
          return {
            ...state,
            collectingEvent: {
              ...state.collectingEvent,
              [v.subState]: { ...newSubState }
            }
          };
        }
        return { ...collectingEvent, [v.fieldName]: v.value };
      }
    ),
    actions.getCollectingEvent$
      .switchMap(getCollectingEventData(ajaxGet))
      .map((outEvent: OutputEvent) => (state: CollectingEventStoreState) => ({
        ...state,
        collectingEvent: outEvent,
        localState: toFrontend(outEvent)
      })),
    actions.addCollectingEvent$
      .switchMap(addCollectingEventData(ajaxPost))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent,
          isDraft: true
        })
      ),
    actions.editEventDateRevision$
      .switchMap(editEventDateRevisionData(ajaxPost))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state
        })
      ),
    actions.editEventPersonRevision$
      .switchMap(editPersonRevisionData(ajaxPost))
      .map(() => (state: CollectingEventStoreState) => ({
        ...state
      })),
    actions.editEventAttributesRevision$
      .switchMap(editEventAttributesRevisionData(ajaxPost))
      .map(() => (state: CollectingEventStoreState) => ({
        ...state
      })),
    actions.addPersonName$
      .switchMap(addPersonNameData(ajaxGet, ajaxPost))
      .map((o: InputPersonName) => (state: CollectingEventStoreState) => {
        const newPersonNames =
          state.personState && state.personState.personNames
            ? state.personState.personNames
            : [];
        const tempPersonNames = [...newPersonNames, { ...o, roleId: 11 }];
        return {
          ...state,
          personState: {
            ...state.personState,
            personName: o,
            personNames: tempPersonNames
          }
        };
      }),
    actions.editEventMetaData$
      .switchMap(editEventMetaData(ajaxPost))
      .map(() => (state: CollectingEventStoreState) => ({
        ...state
      })),
    actions.editEventPlaceRevision$
      .switchMap(editEventPlaceRevisionData(ajaxPost))
      .map(() => (state: CollectingEventStoreState) => ({
        ...state
      }))
  );
};

export const store$ = (
  actions$: Actions = {
    getCollectingEvent$,
    addCollectingEvent$,
    editEventDateRevision$,
    editEventPlaceRevision$,
    editEventPersonRevision$,
    editEventAttributesRevision$,
    setDisabledState$,
    setDraftState$,
    editEventMetaData$,
    addPersonName$,
    getPersonName$
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost,
  ajaxPut: AjaxPost<Star> = simplePut
) => {
  return createStore(
    'collectingEventStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut),
    initialCollectingEventState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;
