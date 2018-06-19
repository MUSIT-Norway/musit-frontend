// @flow
import * as React from 'react';
import predefinedConservation$, {
  loadSampleTypes$,
  setLoadingSampleTypes$,
  setLoadingConservationTypes$,
  loadConservationTypes$
} from './predefinedConservation';
import appSession$ from './appSession';
import { inject } from 'react-rxjs';
import { Observable } from 'rxjs';
import { PredefinedConservation } from '../types/predefinedConservation';
import { AppSession } from '../types/appSession';
import { Star, TODO } from '../types/common';
type Props<T> = {
  appSession: AppSession;
  component: React.ComponentType<T>;
  setLoadingSampleTypes: Function;
  loadSampleTypes: Function;
  predefinedConservation: PredefinedConservation;
  setLoadingConservationTypes: Function;
  loadConservationTypes: Function;
};

class PredefinedConservationLoader<T> extends React.Component<Props<T>> {
  //#OLD props: Props;

  componentWillMount() {
    const inputParams = {
      museumId: this.props.appSession.museumId,
      collectionId: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken,
      isEn: this.props.appSession.language.isEn
    };
    if (!this.isSampleTypesLoaded()) {
      this.props.setLoadingSampleTypes();
      this.props.loadSampleTypes(inputParams);
    }
    if (!this.isConservationTypesLoaded()) {
      this.props.setLoadingConservationTypes();
      this.props.loadConservationTypes(inputParams);
    }
  }

  isSampleTypesLoaded() {
    return (
      !this.props.predefinedConservation.loadingSampleTypes &&
      !!this.props.predefinedConservation.sampleTypes
    );
  }

  isConservationTypesLoaded() {
    return (
      !this.props.predefinedConservation.loadingConservationTypes &&
      !!this.props.predefinedConservation.conservationTypes
    );
  }
  render() {
    if (!this.isSampleTypesLoaded() || !this.isConservationTypesLoaded()) {
      return <div className="loading" />;
    }
    const Component = this.props.component;
    return <Component {...this.props} />;
  }
}

export function loadPredefinedConservationTypes<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return loadCustomPredefinedConservationTypes(
    predefinedConservation$,
    appSession$ as TODO,
    Component
  );
}

export function loadCustomPredefinedConservationTypes<P>(
  predefinedConservation$: Observable<Star>,
  appSession$: Observable<AppSession>,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  type DataType = {
    predefinedConservation: PredefinedConservation;
    appSession: AppSession;
  };
  const data$: Observable<DataType> = Observable.combineLatest(
    predefinedConservation$,
    appSession$
  ).map(([predefinedConservation, appSession]) => ({
    predefinedConservation,
    appSession
  }));
  return inject(data$, (predefinedConservation: DataType, upstream: P) => ({
    ...predefinedConservation,
    ...upstream as TODO
  }))(
    (
      initialProps: P & {
        predefinedConservation: PredefinedConservation;
        appSession: AppSession;
      }
    ) => {
      return (
        <PredefinedConservationLoader
          {...initialProps}
          component={Component}
          setLoadingSampleTypes={setLoadingSampleTypes$.next.bind(setLoadingSampleTypes$)}
          loadSampleTypes={loadSampleTypes$.next.bind(loadSampleTypes$)}
          setLoadingConservationTypes={setLoadingConservationTypes$.next.bind(
            setLoadingConservationTypes$
          )}
          loadConservationTypes={loadConservationTypes$.next.bind(loadConservationTypes$)}
        />
      );
    }
  );
}
