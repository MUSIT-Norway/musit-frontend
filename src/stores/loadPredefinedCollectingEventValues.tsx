import * as React from 'react';
import predefinedCollectingEvents$, {
  setLoadingCoordinateSources$,
  setLoadingGeometryTypes$,
  setLoadingCoordinateTypes$,
  setLoadingCollectingMethods$,
  PredefinedCollectingEventState,
  setLoadingDatumTypes$,
  loadDatumTypes$,
  loadCoordinateSources$,
  loadCoordinateTypes$,
  loadGeometryTypes$,
  loadCollectingMethods$
} from './predefinedCollectingEventValues';
import appSession$ from './appSession';
import { inject } from 'react-rxjs';
import { Observable } from 'rxjs';
import { AppSession } from '../types/appSession';
import { Star, TODO } from '../types/common';
type Props<T> = {
  appSession: AppSession;
  component: React.ComponentType<T>;
  predefinedCollectingEventValues: PredefinedCollectingEventState;
  setLoadingCoordinateSources: Function;
  setLoadingGeometryTypes: Function;
  setLoadingCoordinateTypes: Function;
  setLoadingCollectingMethods: Function;
  loadCollectingMethods: Function;
  setLoadingDatumTypes: Function;
  loadDatumTypes: Function;
  loadCoordinateSources: Function;
  loadCoordinateTypes: Function;
  loadGeomertryTypes: Function;
};

class PredefinedCollectingEventLoader<T> extends React.Component<Props<T>> {
  componentWillMount() {
    const inputParams = {
      token: this.props.appSession.accessToken
    };
    console.log('IP', inputParams);

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

    if (!this.isCollectingMethodsLoaded()) {
      this.props.setLoadingCollectingMethods();
      this.props.loadCollectingMethods(inputParams);
    }
    if (!this.isDatumLoaded()) {
      console.log('isDatumLoaded');
      this.props.setLoadingDatumTypes();
      this.props.loadDatumTypes(inputParams);
    }
  }

  isCollectingMethodsLoaded() {
    console.log('Inne i isCollectingMethodsLoaded');
    return (
      !this.props.predefinedCollectingEventValues.loadingCollectingMethods &&
      !!this.props.predefinedCollectingEventValues.collectingMethods
    );
  }

  isDatumLoaded() {
    return (
      !this.props.predefinedCollectingEventValues.loadingDatum &&
      !!this.props.predefinedCollectingEventValues.datums
    );
  }

  isCoordinateTypesLoaded() {
    return (
      !this.props.predefinedCollectingEventValues.loadingCoordinateTypes &&
      this.props.predefinedCollectingEventValues.coordinateTypes
    );
  }

  isCoordinateSourceLoaded() {
    return (
      !this.props.predefinedCollectingEventValues.loadingDatum &&
      !!this.props.predefinedCollectingEventValues.datums
    );
  }

  isGeometryLoaded() {
    return (
      !this.props.predefinedCollectingEventValues.loadingGeometryTypes &&
      this.props.predefinedCollectingEventValues.geometryTypes
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

export function loadPredefinedCollectingEventValues<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return loadCustomPredefinedCollectingEventValues(
    predefinedCollectingEvents$,
    appSession$ as TODO,
    Component
  );
}

export function loadCustomPredefinedCollectingEventValues<P>(
  predefinedCollectingEventValues$: Observable<Star>,
  appSession$: Observable<AppSession>,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  type DataType = {
    predefinedCollectingEventValues: PredefinedCollectingEventState;
    appSession: AppSession;
  };
  const data$: Observable<DataType> = Observable.combineLatest(
    predefinedCollectingEventValues$,
    appSession$
  ).map(([predefinedCollectingEventValues, appSession]) => ({
    predefinedCollectingEventValues,
    appSession
  }));
  return inject(data$, (predefinedCollectingEventValues: DataType, upstream: P) => ({
    ...predefinedCollectingEventValues,
    ...(upstream as TODO)
  }))(
    (
      initialProps: P & {
        predefinedCollectingEventValues: PredefinedCollectingEventState;
        appSession: AppSession;
      }
    ) => {
      return (
        <PredefinedCollectingEventLoader
          {...initialProps}
          component={Component}
          setLoadingCollectingMethods={setLoadingCollectingMethods$.next.bind(
            setLoadingCollectingMethods$
          )}
          loadCollectingMethods={loadCollectingMethods$.next.bind(loadCollectingMethods$)}
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
