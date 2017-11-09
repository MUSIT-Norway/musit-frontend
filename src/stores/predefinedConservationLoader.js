// @flow
import React from 'react';
import predefinedConservation$, {
  loadSampleTypes$,
  setLoadingSampleTypes$,
  setLoadingConservationTypes$,
  loadConservationTypes$
} from './predefinedConservation';
import appSession$ from './appSession';
import inject from 'react-rxjs/dist/RxInject';
import { Observable } from 'rxjs';
import type { PredefinedConservation } from 'types/predefinedConservation';
import type { AppSession } from 'types/appSession';

type Props = {
  appSession: AppSession,
  component: Function,
  setLoadingSampleTypes: Function,
  loadSampleTypes: Function,
  predefinedConservation: PredefinedConservation,
  setLoadingConservationTypes: Function,
  loadConservationTypes: Function
};

class PredefinedConservationLoader extends React.Component<Props, void> {
  props: Props;

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
  Component: React$ComponentType<P>
): React$ComponentType<P> {
  return loadCustomPredefinedConservationTypes(
    predefinedConservation$,
    appSession$,
    Component
  );
}

export function loadCustomPredefinedConservationTypes<P>(
  predefinedConservation$: Observable<*>,
  appSession$: Observable<*>,
  Component: React$ComponentType<P>
): React$ComponentType<P> {
  type DataType = {
    predefinedConservation: PredefinedConservation,
    appSession: AppSession
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
    ...(upstream: any)
  }))(
    (
      initialProps: P & {
        predefinedConservation: PredefinedConservation,
        appSession: AppSession
      }
    ) => {
      return (
        <PredefinedConservationLoader
          {...(initialProps: any)}
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
