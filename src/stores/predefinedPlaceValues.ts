import { Observable, Subject } from 'rxjs';
import {
  loadDatum,
  loadCoordinateSources,
  loadCoordinateTypes,
  loadGeometryTypes
} from '../models/object/place';

import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';

import { simpleGet } from '../shared/RxAjax';
import { Star } from '../types/common';

export type PredefinedPlaceProps = {
  datums: string[] | null;
  coordinateTypes: string[] | null;
  coordinateSources: string[] | null;
  geometryTypes: string[] | null;
};

export type PredefinedPlaceState = PredefinedPlaceProps & {
  loadingDatum?: boolean;
  loadingGeometryTypes?: boolean;
  loadingCoordinateTypes?: boolean;
  loadingCoordinateSources?: boolean;
};

export const initialState: PredefinedPlaceState = {
  loadingDatum: false,
  loadingCoordinateSources: false,
  loadingCoordinateTypes: false,
  loadingGeometryTypes: false,
  datums: null,
  coordinateSources: null,
  geometryTypes: null,
  coordinateTypes: null
};

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
    actions.setLoadingCoordinateTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingCoordinateTypes: true
    })),
    actions.loadCoordinateTypes$.map(
      (cooordinateTypes: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        cooordinateTypes,
        loadingCoordinateTypes: false
      })
    ),
    actions.setLoadingCoordinateSources$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingCoordinateSources: true
    })),
    actions.setLoadingDatumTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingDatum: true
    })),
    actions.loadDatumTypes$.map((datums: string[]) => (state: PredefinedPlaceState) => ({
      ...state,
      datums,
      loadingDatum: false
    })),
    actions.loadCoordinateSources$.map(
      (coordinateSources: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        coordinateSources,
        loadingCoordinateSources: false
      })
    ),
    actions.setLoadingGeometryTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingGeometryTypes: true
    })),
    actions.loadGeometryTypes$.map(
      (geometryTypes: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        geometryTypes,
        loadingGeometryTypes: false
      })
    )
  );
}

const store$ = (actions: { [key: string]: Observable<Star> }) =>
  createStore('predefinedPlaceValues', reducer$(actions), initialState, KEEP_ALIVE);

export default store$({
  setLoadingDatumTypes$,
  loadDatumTypes$: loadDatumTypesAction$,
  setLoadingCoordinateSources$,
  loadCoordinateSources$: loadCoordinateSourcesAction$,
  setLoadingGeometryTypes$,
  loadGeometryTypes$: loadGeometryTypesAction$,
  setLoadingCoordinateTypes$,
  loadCoordinateTypes$: loadCoordinateTypesAction$
});
