import { Observable, Subject } from 'rxjs';
import {
  loadDatum,
  loadCoordinateSources,
  loadCoordinateTypes,
  loadGeometryTypes
} from '../models/object/place';

import { getCollectingEventMethods } from '../models/object/collectingEvent';

import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';

import { simpleGet } from '../shared/RxAjax';
import { Star } from '../types/common';

export type PredefinedCollectingEventProps = {
  datums: string[] | null;
  coordinateTypes: string[] | null;
  coordinateSources: string[] | null;
  geometryTypes: string[] | null;
  collectingMethods: string[] | null;
};

export type PredefinedCollectingEventState = PredefinedCollectingEventProps & {
  loadingDatum?: boolean;
  loadingGeometryTypes?: boolean;
  loadingCoordinateTypes?: boolean;
  loadingCoordinateSources?: boolean;
  loadingCollectingMethods?: boolean;
};

export const initialState: PredefinedCollectingEventState = {
  loadingDatum: false,
  loadingCollectingMethods: false,
  loadingCoordinateSources: false,
  loadingCoordinateTypes: false,
  loadingGeometryTypes: false,
  datums: null,
  coordinateSources: null,
  geometryTypes: null,
  coordinateTypes: null,
  collectingMethods: null
};

export const setLoadingCollectingMethods$: Subject<Star> = createAction(
  'setLoadingCollectingMethods$'
);
export const loadCollectingMethods$: Subject<Star> = createAction(
  'loadCollectingMethods$'
);
export const loadCollectingMethodsAction$: Observable<
  Star
> = loadCollectingMethods$.switchMap(getCollectingEventMethods(simpleGet));

export const setLoadingDatumTypes$: Subject<Star> = createAction('setLoadingDatumTypes$');
export const loadDatumTypes$: Subject<Star> = createAction('loadDatumTypes$');
export const loadDatumTypesAction$: Observable<Star> = loadDatumTypes$.switchMap(
  loadDatum(simpleGet)
);
export const setLoadingCoordinateTypes$: Subject<Star> = createAction(
  'setLoadingCoordinateTypes$'
);
export const loadCoordinateTypes$: Subject<Star> = createAction('loadCoordinateTypes$');
export const loadCoordinateTypesAction$: Observable<
  Star
> = loadCoordinateTypes$.switchMap(loadCoordinateTypes(simpleGet));

export const setLoadingCoordinateSources$: Subject<Star> = createAction(
  'setLoadingCoordinateSources$'
);
export const loadCoordinateSources$: Subject<Star> = createAction(
  'loadCoordinateSources$'
);
export const loadCoordinateSourcesAction$: Observable<
  Star
> = loadCoordinateSources$.switchMap(loadCoordinateSources(simpleGet));

export const setLoadingGeometryTypes$: Subject<Star> = createAction(
  'setLoadingGeometryTypes$'
);
export const loadGeometryTypes$: Subject<Star> = createAction('loadGeomertryTypes$');
const loadGeometryTypesAction$: Observable<Star> = loadGeometryTypes$.switchMap(
  loadGeometryTypes(simpleGet)
);

export function reducer$(actions: {
  [key: string]: Observable<Star>;
}): Observable<Reducer<any>> {
  return Observable.merge(
    actions.setLoadingCollectingMethods$.map(
      () => (state: PredefinedCollectingEventState) => ({
        ...state,
        loadingCollectingMethods: true
      })
    ),
    actions.loadCollectingMethods$.map(
      (collectingMethods: string[]) => (state: PredefinedCollectingEventState) => ({
        ...state,
        collectingMethods,
        loadingCollectingMethods: false
      })
    ),
    actions.setLoadingCoordinateTypes$.map(
      () => (state: PredefinedCollectingEventState) => ({
        ...state,
        loadingCoordinateTypes: true
      })
    ),
    actions.loadCoordinateTypes$.map(
      (coordinateTypes: string[]) => (state: PredefinedCollectingEventState) => ({
        ...state,
        coordinateTypes,
        loadingCoordinateTypes: false
      })
    ),
    actions.setLoadingCoordinateSources$.map(
      () => (state: PredefinedCollectingEventState) => ({
        ...state,
        loadingCoordinateSources: true
      })
    ),
    actions.setLoadingDatumTypes$.map(() => (state: PredefinedCollectingEventState) => ({
      ...state,
      loadingDatum: true
    })),
    actions.loadDatumTypes$.map(
      (datums: string[]) => (state: PredefinedCollectingEventState) => ({
        ...state,
        datums,
        loadingDatum: false
      })
    ),
    actions.loadCoordinateSources$.map(
      (coordinateSources: string[]) => (state: PredefinedCollectingEventState) => ({
        ...state,
        coordinateSources,
        loadingCoordinateSources: false
      })
    ),
    actions.setLoadingGeometryTypes$.map(
      () => (state: PredefinedCollectingEventState) => ({
        ...state,
        loadingGeometryTypes: true
      })
    ),
    actions.loadGeometryTypes$.map(
      (geometryTypes: string[]) => (state: PredefinedCollectingEventState) => ({
        ...state,
        geometryTypes,
        loadingGeometryTypes: false
      })
    )
  );
}

const store$ = (actions: { [key: string]: Observable<Star> }) =>
  createStore(
    'predefinedCollectingEventValues',
    reducer$(actions),
    initialState,
    KEEP_ALIVE
  );

export default store$({
  setLoadingCollectingMethods$,
  loadCollectingMethods$: loadCollectingMethodsAction$,
  setLoadingDatumTypes$,
  loadDatumTypes$: loadDatumTypesAction$,
  setLoadingCoordinateSources$,
  loadCoordinateSources$: loadCoordinateSourcesAction$,
  setLoadingGeometryTypes$,
  loadGeometryTypes$: loadGeometryTypesAction$,
  setLoadingCoordinateTypes$,
  loadCoordinateTypes$: loadCoordinateTypesAction$
});
