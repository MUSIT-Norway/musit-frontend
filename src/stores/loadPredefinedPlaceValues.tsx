// @flow
import * as React from 'react';
import predefinedPlaces$, {
  setLoadingCoordinateSources$,
  setLoadingGeometryTypes$,
  setLoadingCoordinateTypes$,
  PredefinedPlaceState,
  setLoadingDatumTypes$,
  loadDatumTypes$,
  loadCoordinateSources$,
  loadCoordinateTypes$,
  loadGeometryTypes$
} from './predefinedPlaceValues';
import appSession$ from './appSession';
import { inject } from 'react-rxjs';
import { Observable } from 'rxjs';
import { AppSession } from '../types/appSession';
import { Star, TODO } from '../types/common';
type Props<T> = {
  appSession: AppSession;
  component: React.ComponentType<T>;
  predefinedPlaceValues: PredefinedPlaceState;
  setLoadingCoordinateSources: Function;
  setLoadingGeometryTypes: Function;
  setLoadingCoordinateTypes: Function;
  setLoadingDatumTypes: Function;
  loadDatumTypes: Function;
  loadCoordinateSources: Function;
  loadCoordinateTypes: Function;
  loadGeomertryTypes: Function;
};

class PredefinedPlaceLoader<T> extends React.Component<Props<T>> {
  componentWillMount() {
    const inputParams = {
      museumId: this.props.appSession.museumId,
      collectionId: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken
    };
    if (!this.isDatumLoaded()) {
      this.props.setLoadingDatumTypes();
      this.props.loadDatumTypes(inputParams);
    }
    if (!this.isCoordinateTypesLoaded()) {
      this.props.setLoadingCoordinateTypes();
      this.props.loadCoordinateTypes(inputParams);
    }
    if (!this.isCoordinateSourceLoaded()) {
      this.props.setLoadingCoordinateTypes();
      this.props.loadCoordinateSources(inputParams);
    }
    if (!this.isCoordinateTypesLoaded()) {
      this.props.setLoadingCoordinateTypes();
      this.props.loadCoordinateTypes(inputParams);
    }
  }

  isDatumLoaded() {
    return (
      !this.props.predefinedPlaceValues.loadingDatum &&
      !!this.props.predefinedPlaceValues.datums
    );
  }

  isCoordinateTypesLoaded() {
    return (
      !this.props.predefinedPlaceValues.loadingCoordinateTypes &&
      this.props.predefinedPlaceValues.coordinateTypes
    );
  }

  isCoordinateSourceLoaded() {
    return (
      !this.props.predefinedPlaceValues.loadingDatum &&
      !!this.props.predefinedPlaceValues.datums
    );
  }

  isGeometryLoaded() {
    return (
      !this.props.predefinedPlaceValues.loadingGeometryTypes &&
      this.props.predefinedPlaceValues.geometryTypes
    );
  }
  render() {
    if (
      !this.isCoordinateSourceLoaded() ||
      !this.isDatumLoaded() ||
      !this.isCoordinateTypesLoaded() ||
      !this.isGeometryLoaded()
    ) {
      return <div className="loading" />;
    }
    const Component = this.props.component;
    return <Component {...this.props} />;
  }
}

export function loadPredefinedPlaceValues<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return loadCustomPredefinedPlaceValues(
    predefinedPlaces$,
    appSession$ as TODO,
    Component
  );
}

export function loadCustomPredefinedPlaceValues<P>(
  predefinedPlaceValues$: Observable<Star>,
  appSession$: Observable<AppSession>,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  type DataType = {
    predefinedPlaceValues: PredefinedPlaceState;
    appSession: AppSession;
  };
  const data$: Observable<DataType> = Observable.combineLatest(
    predefinedPlaceValues$,
    appSession$
  ).map(([predefinedPlaceValues, appSession]) => ({
    predefinedPlaceValues,
    appSession
  }));
  return inject(data$, (predefinedPlaceValues: DataType, upstream: P) => ({
    ...predefinedPlaceValues,
    ...(upstream as TODO)
  }))(
    (
      initialProps: P & {
        predefinedPlaceValues: PredefinedPlaceState;
        appSession: AppSession;
      }
    ) => {
      return (
        <PredefinedPlaceLoader
          {...initialProps}
          component={Component}
          setLoadingCoordinateTypes={setLoadingCoordinateTypes$.next.bind(
            setLoadingCoordinateTypes$
          )}
          loadCoordinateTypes={loadCoordinateTypes$.next.bind(loadCoordinateTypes$)}
          setLoadingCoordinateSources={setLoadingCoordinateSources$.next.bind(
            setLoadingCoordinateSources$
          )}
          loadCoordinateSources={loadCoordinateSources$.next.bind(loadCoordinateSources$)}
          setLoadingDatumTypes={setLoadingDatumTypes$.next.bind(setLoadingDatumTypes$)}
          loadDatumTypes={loadDatumTypes$.next.bind(loadDatumTypes$)}
          setLoadingGeometryTypes={setLoadingGeometryTypes$.next.bind(
            setLoadingGeometryTypes$
          )}
          loadGeomertryTypes={loadGeometryTypes$.next.bind(loadGeometryTypes$)}
        />
      );
    }
  );
}
