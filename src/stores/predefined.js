import React from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import Analysis from '../models/analysis';
import Sample from '../models/sample';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const setLoadingSampleTypes$ = createAction('setLoadingSampleTypes$');
export const loadSampleTypes$ = createAction('loadSampleTypes$').switchMap(
  Sample.loadPredefinedTypes()
);
export const setLoadingAnalysisTypes$ = createAction('setLoadingAnalysisTypes$');
export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(
  Analysis.loadPredefinedTypes()
);

export const reducer$ = actions =>
  Observable.empty().merge(
    actions.setLoadingSampleTypes$.map(() => state => ({
      ...state,
      loadingSampleTypes: true
    })),
    actions.loadSampleTypes$.map(sampleTypes => state => ({
      ...state,
      ...sampleTypes,
      loadingSampleTypes: false
    })),
    actions.setLoadingAnalysisTypes$.map(() => state => ({
      ...state,
      loadingAnalysisTypes: true
    })),
    actions.loadAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      ...analysisTypes,
      loadingAnalysisTypes: false
    }))
  );

export const store$ = actions =>
  createStore(
    'predefined',
    reducer$(actions),
    Observable.of({ loadingSampleTypes: false, loadingAnalysisTypes: false })
  );

export default store$({
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
});

class PredefinedLoader extends React.Component {
  static propTypes = {
    appSession: PropTypes.shape({
      museumId: PropTypes.number,
      collectionId: PropTypes.string,
      accessToken: PropTypes.string
    }).isRequired,
    setLoadingAnalysisTypes: PropTypes.func.isRequired,
    loadAnalysisTypes: PropTypes.func.isRequired,
    setLoadingSampleTypes: PropTypes.func.isRequired,
    loadSampleTypes: PropTypes.func.isRequired,
    component: PropTypes.any.isRequired
  };

  componentWillMount() {
    const inputParams = {
      museumId: this.props.appSession.museumId,
      collectionId: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken
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

export const loadPredefinedTypes = Component => {
  return initialProps => {
    return (
      <PredefinedLoader
        {...initialProps}
        component={Component}
        setLoadingAnalysisTypes={setLoadingAnalysisTypes$.next.bind(
          setLoadingAnalysisTypes$
        )}
        loadAnalysisTypes={loadAnalysisTypes$.next.bind(loadAnalysisTypes$)}
        setLoadingSampleTypes={setLoadingSampleTypes$.next.bind(setLoadingSampleTypes$)}
        loadSampleTypes={loadSampleTypes$.next.bind(loadSampleTypes$)}
      />
    );
  };
};
