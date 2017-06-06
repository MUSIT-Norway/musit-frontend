import React from 'react';
import { IndexRedirect, IndexRoute, Route, Router, hashHistory } from 'react-router';
import NotFound from './components/NotFound';
import AboutView from './modules/about/AboutPage';
import PickListView from './modules/picklist/PickListContainer';
import StorageUnitsTable from './modules/storagefacility/TableContainer';
import KDReportComponent from './modules/reports/KDReportComponent';
import AddStorageUnitPanel from './modules/storagefacility/AddNodeComponent';
import EditStorageUnitPanel from './modules/storagefacility/EditNodeComponent';
import AddObservationPage from './modules/observation/AddObservationPage';
import EditObservationPage from './modules/observation/EditObservationPage';
import ViewObservationPage from './modules/observation/ViewObservationPage';
import Reports from './modules/reports/ReportsOverview';
import ControlViewContainer from './modules/control/ControlViewComponent';
import ControlAddContainer from './modules/control/ControlAddComponent';
import EventsContainer from './modules/controlsobservations/EventsComponent';
import ObjectSearchContainer from './modules/objectsearch/ObjectSearchContainer';
import AppComponent from './modules/app/AppComponent';
import AnalysisAddContainer from './modules/analysis/AnalysisAddContainer';
import AnalysisViewContainer from './modules/analysis/AnalysisViewContainer';
import AnalysisEditContainer from './modules/analysis/AnalysisEditContainer';
import SampleFormAddContainer from './modules/sample/sampleAddContainer';
import SampleViewContainer from './modules/sample/sampleViewContainer';
import SampleEditContainer from './modules/sample/sampleEditContainer';
import CenteredLayout from './components/layout/CenteredLayout';
import ViewObjectContainer from './modules/objects/viewObjectContainer';
import SampleIndexMultiple from './poc/multiple/SampleIndex';
import SampleEditMultiple from './poc/multiple/SampleEdit';
import SampleIndexSingle from './poc/single/SampleIndex';
import SampleEditSingle from './poc/single/SampleEdit';
import HomeView from './modules/home/HomePage';
import Administration from './modules/administration/Administration';
import AnalysisTypes from './modules/administration/analysisTypes/analysisTypesContainer';
import AnalysisPlaces from './modules/administration/analysisPlaces/analysisPlacesContainer';
import SampleTypes from './modules/administration/sampleTypes/sampleTypesContainer';

export default () => {
  return (
    <Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory}>
      <Route>
        <Route component={CenteredLayout}>
          <Route path="sample/index/multiple" component={SampleIndexMultiple} />
          <Route path="sample/edit/multiple" component={SampleEditMultiple} />
          <Route path="sample/index/single" component={SampleIndexSingle} />
          <Route path="sample/edit/single" component={SampleEditSingle} />
        </Route>
        <Route
          path="/(museum/:museumId/)(collections/:collectionIds/)"
          component={AppComponent}
        >
          <IndexRedirect to="magasin" />
          <Route path="magasin">
            <IndexRoute component={StorageUnitsTable} />
            <Route path="add" add component={AddStorageUnitPanel} />
            <Route path=":id/add" add component={AddStorageUnitPanel} />
            <Route path=":id/view" component={EditStorageUnitPanel} />
            <Route
              path=":id/controls"
              showControls
              showObservations={false}
              component={EventsContainer}
            />
            <Route
              path=":id/controlsobservations"
              showObservations
              showControls
              component={EventsContainer}
            />
            <Route path=":id/control/add" component={ControlAddContainer} />
            <Route path=":id/control/:controlId" component={ControlViewContainer} />
            <Route
              path=":id/observations"
              showObservations
              showControls={false}
              component={EventsContainer}
            />
            <Route path=":id/observation/add" component={AddObservationPage} />
            <Route path=":id/observation/edit" component={EditObservationPage} />
            <Route path=":id/observation/:obsId" component={ViewObservationPage} />
            <Route path=":id/objects" showObjects component={StorageUnitsTable} />
            <Route path=":id" component={StorageUnitsTable} />
          </Route>
          <Route component={CenteredLayout}>
            <Route path="objects/:id" component={ViewObjectContainer} />
            <Route path="analysis">
              <Route path="add" component={AnalysisAddContainer} />
              <Route path="edit/:analysisId" component={AnalysisEditContainer} />
              <Route path=":analysisId" component={AnalysisViewContainer} />
              <Route path="sample">
                <Route path=":objectId/add" component={SampleFormAddContainer} />
                <Route path=":sampleId/edit" component={SampleEditContainer} />
                <Route path=":sampleId" component={SampleViewContainer} />
              </Route>
            </Route>
            <Route path="administration">
              <IndexRoute component={Administration} />
              <Route path="analysistypes" component={AnalysisTypes} />
              <Route path="analysisplaces" component={AnalysisPlaces} />
              <Route path="sampletypes" component={SampleTypes} />
            </Route>
          </Route>
          <Route path="picklist">
            <Route path="nodes" type="nodes" component={PickListView} />
            <Route path="objects" type="objects" component={PickListView} />
          </Route>
          <Route path="reports">
            <IndexRoute component={Reports} />
            <Route path="kdreport" component={KDReportComponent} />
          </Route>
          <Route path="search/objects" component={ObjectSearchContainer} />
          <Route path="about" component={AboutView} />
          <Route path="home" component={HomeView} />

          -- Catch all route
          <Route path="*" component={NotFound} status={404} />
        </Route>
      </Route>
    </Router>
  );
};
