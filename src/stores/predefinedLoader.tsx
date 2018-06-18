// @flow
import * as React from 'react';
import predefined$, {
  loadSampleTypes$,
  loadAnalysisTypes$,
  setLoadingAnalysisTypes$,
  setLoadingSampleTypes$,
  setLoadingConservationTypes$,
  loadConservationTypes$
} from './predefined';
import appSession$ from './appSession';
import { inject } from 'react-rxjs';
import { Observable } from 'rxjs';
import { Predefined } from '../types/predefined';
import { AppSession } from '../types/appSession';
import { Star, TODO } from '../types/common';

//TODO: Props or Props<T> here? (Both seems to be syntactially correct here)
type Props = {
  appSession: AppSession;
  setLoadingAnalysisTypes: Function;
  loadAnalysisTypes: Function;
  setLoadingSampleTypes: Function;
  loadSampleTypes: Function;
  component: React.ComponentType<Props>;
  predefined: Predefined;
  setLoadingConservationTypes: Function;
  loadConservationTypes: Function;
};

class PredefinedLoader extends React.Component<Props> {
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
    if (!this.isConservationTypesLoaded()) {
      this.props.setLoadingConservationTypes();
      this.props.loadConservationTypes(inputParams);
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

  isConservationTypesLoaded() {
    return (
      !this.props.predefined.loadingConservationTypes &&
      !!this.props.predefined.conservationTypes
    );
  }
  render() {
    if (
      !this.isAnalysisTypesLoaded() ||
      !this.isSampleTypesLoaded() ||
      !this.isConservationTypesLoaded()
    ) {
      return <div className="loading" />;
    }
    const Component = this.props.component;
    return <Component {...this.props} />;
  }
}

export function loadPredefinedTypes<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return loadCustomPredefinedTypes(predefined$, appSession$, Component);
}

export function loadCustomPredefinedTypes<P>(
  predefined$: Observable<Star>,
  appSession$: Observable<Star>,
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  type DataType = { predefined: Predefined; appSession: AppSession };
  const data$: Observable<DataType> = Observable.combineLatest(
    predefined$,
    appSession$
  ).map(([predefined, appSession]) => ({ predefined, appSession }));
  return inject(data$, (predefined: DataType, upstream: P) => ({
    ...predefined,
    ...upstream as TODO
  }))((initialProps: P & { predefined: Predefined; appSession: AppSession }) => {
    return (
      <PredefinedLoader
        {...initialProps as TODO}
        component={Component}
        setLoadingAnalysisTypes={setLoadingAnalysisTypes$.next.bind(
          setLoadingAnalysisTypes$
        )}
        loadAnalysisTypes={loadAnalysisTypes$.next.bind(loadAnalysisTypes$)}
        setLoadingSampleTypes={setLoadingSampleTypes$.next.bind(setLoadingSampleTypes$)}
        loadSampleTypes={loadSampleTypes$.next.bind(loadSampleTypes$)}
        setLoadingConservationTypes={setLoadingConservationTypes$.next.bind(
          setLoadingConservationTypes$
        )}
        loadConservationTypes={loadConservationTypes$.next.bind(loadConservationTypes$)}
      />
    );
  });
}
