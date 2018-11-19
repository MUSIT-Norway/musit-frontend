import {
  getCollectingEvent,
  addCollectingEvent,
  CollectingEvent,
  InputCollectingEvent,
  OutputCollectingEvent,
  editEventDateRevision,
  editEventPlaceRevision,
  InputDateRevision,
  InputPlaceAndRelation
} from '../../../models/object/collectingEvent';
import { addPlace, InputPlace, inputPlace } from '../../../models/object/place';
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

export type CollectingEventStoreState = {
  localState?: CollectingEventState;
  collectingEvent?: InputCollectingEvent;
  collectingEventList?: Array<InputCollectingEvent>;
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
};
export const initialCollectingEventState = {
  collectingEvent: {
    eventType: 6,
    name: ''
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
  data: CollectingEventState;
  id: string;
};

export const toBackend: ((p: CollectingEventState) => InputCollectingEvent) = (
  p: CollectingEventState
) => {
  const c = new CollectingEvent(
    p.eventData.name,
    p.eventData.eventUuid,
    p.eventData.eventType,
    p.eventData.methodId,
    p.eventData.method,
    p.eventData.methodDescription,
    p.eventData.museumId,
    p.eventData.collectionId,
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

const editEventDateRevisionData = (ajaxPut: AjaxPut<Star>) => (
  props: EditCollectingEventProps
) =>
  Observable.of(props).flatMap(props => {
    const InputPlaceAndRevision = new InputDateRevision(
      props.data && props.data.eventData.eventDateFrom
        ? props.data.eventData.eventDateFrom
        : '',
      props.data && props.data.eventData.eventDateTo
        ? props.data.eventData.eventDateTo
        : '',
      props.data && props.data.eventData.eventDateVerbatim
        ? props.data.eventData.eventDateVerbatim
        : ''
    );
    return editEventDateRevision(ajaxPut)({
      id: props.id,
      data: InputPlaceAndRevision,
      token: props.token,
      callback: props.callback
    });
  });

const editEventPlaceRevisionData = (ajaxPut: AjaxPut<Star>) => (
  props: EditCollectingEventProps
) =>
  Observable.of(props).flatMap(props => {
    const InputPlaceAndRevision = new InputPlaceAndRelation(
      props.data.placeState && props.data.placeState.placeUuid
        ? props.data.placeState.placeUuid
        : '',
      15
    );

    return editEventPlaceRevision(ajaxPut)({
      id: props.id,
      data: InputPlaceAndRevision,
      token: props.token,
      callback: props.callback
    });
  });

export const addCollectingEvent$: Subject<
  AddCollectingEventProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addCollectingEvent$');

export const setDisabledState$: Subject<{
  fieldName: string;
  value: boolean;
}> = createAction('setDisabledState$');

export const getCollectingEvent$: Subject<
  GetCollectingEventProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getCollectingEvent$');

export const editEventDateRevision$: Subject<
  EditCollectingEventProps & {
    ajaxPut: AjaxPut<Star>;
  }
> = createAction('editEventDateRevision$');

export const editEventPlaceRevision$: Subject<
  EditCollectingEventProps & {
    ajaxPut: AjaxPut<Star>;
  }
> = createAction('editEventPlaceRevision$');

type Actions = {
  getCollectingEvent$: Subject<GetCollectingEventProps>;
  addCollectingEvent$: Subject<AddCollectingEventProps>;
  editEventDateRevision$: Subject<EditCollectingEventProps>;
  editEventPlaceRevision$: Subject<EditCollectingEventProps>;
  setDisabledState$: Subject<{ fieldName: string; value: boolean }>;
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
    actions.getCollectingEvent$
      .switchMap(getCollectingEventData(ajaxGet))
      .map((outEvent: OutputCollectingEvent) => (state: CollectingEventStoreState) => ({
        ...state,
        eventState: outEvent,
        localState: toFrontend(outEvent)
      })),
    actions.addCollectingEvent$
      .switchMap(addCollectingEventData(ajaxPost))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent
        })
      ),
    actions.editEventDateRevision$
      .switchMap(editEventDateRevisionData(ajaxPut))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent
        })
      ),
    actions.editEventPlaceRevision$
      .switchMap(editEventPlaceRevisionData(ajaxPut))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent
        })
      )
  );
};

export const store$ = (
  actions$: Actions = {
    getCollectingEvent$,
    addCollectingEvent$,
    editEventDateRevision$,
    editEventPlaceRevision$,
    setDisabledState$
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
