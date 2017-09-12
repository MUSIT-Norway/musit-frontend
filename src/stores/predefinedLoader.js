// @flow
import React from 'react';
import predefined$, {
  loadSampleTypes$,
  loadAnalysisTypes$,
  setLoadingAnalysisTypes$,
  setLoadingSampleTypes$
} from './predefined';
import appSession$ from './appSession';
import inject from 'react-rxjs/dist/RxInject';
import { Observable } from 'rxjs';
import type { Predefined } from 'types/predefined';
import type { AppSession } from 'types/appSession';

type Props = {
  appSession: AppSession,
  setLoadingAnalysisTypes: Function,
  loadAnalysisTypes: Function,
  setLoadingSampleTypes: Function,
  loadSampleTypes: Function,
  component: Function,
  predefined: Predefined
};

class PredefinedLoader extends React.Component<Props, void> {
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
    if (!this.isAnalysisTypesLoaded()) {
      this.props.setLoadingAnalysisTypes();
      this.props.loadAnalysisTypes(inputParams);
    }
  }

  isSampleTypesLoaded() {
    return (
      !this.props.predefined.loadingSampleTypes && !!this.props.predefined.sampleTypes
    );
  }

  isAnalysisTypesLoaded() {
    return (
      !this.props.predefined.loadingAnalysisTypes && !!this.props.predefined.analysisTypes
    );
  }

  render() {
    if (!this.isAnalysisTypesLoaded() || !this.isSampleTypesLoaded()) {
      return <div className="loading" />;
    }
    const Component = this.props.component;
    return <Component {...this.props} />;
  }
}

export function loadPredefinedTypes<P>(
  Component: React$ComponentType<P>
): React$ComponentType<P> {
  return loadCustomPredefinedTypes(predefined$, appSession$, Component);
}

export function loadCustomPredefinedTypes<P>(
  predefined$: Observable<*>,
  appSession$: Observable<*>,
  Component: React$ComponentType<P>
): React$ComponentType<P> {
  type DataType = { predefined: Predefined, appSession: AppSession };
  const data$: Observable<DataType> = Observable.combineLatest(
    predefined$,
    appSession$
  ).map(([predefined, appSession]) => ({ predefined, appSession }));
  return inject(data$, (predefined: DataType, upstream: P) => ({
    ...predefined,
    ...(upstream: any)
  }))((initialProps: P & { predefined: Predefined, appSession: AppSession }) => {
    return (
      <PredefinedLoader
        {...(initialProps: any)}
        component={Component}
        setLoadingAnalysisTypes={setLoadingAnalysisTypes$.next.bind(
          setLoadingAnalysisTypes$
        )}
        loadAnalysisTypes={loadAnalysisTypes$.next.bind(loadAnalysisTypes$)}
        setLoadingSampleTypes={setLoadingSampleTypes$.next.bind(setLoadingSampleTypes$)}
        loadSampleTypes={loadSampleTypes$.next.bind(loadSampleTypes$)}
      />
    );
  });
}
