import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './components/NotFound';
import ScrollToTop, { scrollToTop } from './components/layout/ScrollToTop';
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
import ViewObjectContainer from './modules/objects/viewObjectContainer';
import HomeView from './modules/home/HomePage';
import Administration from './modules/administration/Administration';
import AnalysisTypes from './modules/administration/analysisTypes/analysisTypesContainer';
import AnalysisPlaces
  from './modules/administration/analysisPlaces/analysisPlacesContainer';
import SampleTypes from './modules/administration/sampleTypes/sampleTypesContainer';
import AnalysisEventsViewContainer
  from './modules/analysis/events/analysisEventsViewContainer';
import AnalysisResultExchangeContainer
  from './modules/analysis/exchange/analysisResultExchangeContainer';
import { replace } from 'lodash';

/**
 *
 * Higher order components and helper functions
 * Helper components for the router
 */

const extraProps = (Component, extraProps) => originProps => (
  <Component {...Object.assign({}, originProps, extraProps)} />
);

/**
 * Creates a route path based on the current path from the router.
 *
 * @param props that comes from the router
 * @param path that should be appended to the current route
 */
const rt = (props, path) => replace(props.match.path + '/' + path, /(\/+)/g, '/');

/**
 * Route pages
 *
 * Each sub domain has its own page.
 */

const MusitRouter = () => (
  <BrowserRouter>
    <div>
      <Route path="/" component={AppPage} />
    </div>
  </BrowserRouter>
);

const AppPage = props => (
  <AppComponent {...props} goTo={props.history.push}>
    <Switch>
      <Route exact path={rt(props, '/')} component={HomePage} />
      <Route exact path={rt(props, '/home')} component={HomePage} />
      <Route exact path={rt(props, '/about')} component={AboutPage} />
      <Route
        path={rt(props, '/museum/:museumId/collections/:collectionIds')}
        component={MuseumAndCollectionPage}
      />

      <Route component={NotFoundPage} />
    </Switch>
  </AppComponent>
);

const HomePage = scrollToTop(HomeView);
const AboutPage = scrollToTop(AboutView);

const MuseumAndCollectionPage = props => (
  <Switch>
    <Route path={rt(props, '/magasin')} component={MagasinPage} />
    <Route path={rt(props, '/picklist')} component={PicklistPage} />
    <Route path={rt(props, '/objects')} component={ObjectPage} />
    <Route path={rt(props, '/analysis')} component={AnalysisPage} />
    <Route path={rt(props, '/administration')} component={AdministrationPage} />
    <Route path={rt(props, '/reports')} component={ReportsPage} />
    <Route path={rt(props, '/search')} component={SearchPage} />

    <Route component={NotFoundPage} />
  </Switch>
);

const PicklistPage = props => (
  <ScrollToTop>
    <Switch>
      <Route
        path={rt(props, '/nodes')}
        exact
        component={extraProps(PickListView, { type: 'nodes' })}
      />
      <Route
        path={rt(props, '/objects')}
        exact
        component={extraProps(PickListView, { type: 'objects' })}
      />

      <Route component={NotFoundPage} />
    </Switch>
  </ScrollToTop>
);

const MagasinPage = props => (
  <Switch>
    <Route path={rt(props, '/')} exact component={StorageUnitsTable} />
    <Route path={rt(props, '/add')} exact component={AddStorageUnitPanel} />
    <Route path={rt(props, '/:id/add')} exact component={AddStorageUnitPanel} />
    <Route path={rt(props, '/:id/view')} exact component={EditStorageUnitPanel} />
    <Route
      path={rt(props, '/:id/controlsobservations')}
      exact
      component={extraProps(EventsContainer, {
        showControls: true,
        showObservations: true
      })}
    />
    <Route path={rt(props, '/:id/control/add')} exact component={ControlAddContainer} />
    <Route
      path={rt(props, '/:id/control/:controlId')}
      exact
      component={ControlViewContainer}
    />
    <Route
      path={rt(props, '/:id/observation/add')}
      exact
      component={AddObservationPage}
    />
    <Route
      path={rt(props, '/:id/observation/edit')}
      exact
      component={EditObservationPage}
    />
    <Route
      path={rt(props, '/:id/observation/:obsId')}
      exact
      component={ViewObservationPage}
    />
    <Route
      path={rt(props, '/:id/objects/:page?')}
      exact
      component={extraProps(StorageUnitsTable, {
        showObjects: true
      })}
    />
    <Route path={rt(props, '/:id/:page?')} exact component={StorageUnitsTable} />
    <Route component={NotFoundPage} />
  </Switch>
);

const ObjectPage = props => (
  <Switch>
    <Route path={rt(props, '/:id')} exact component={ViewObjectContainer} />

    <Route component={NotFoundPage} />
  </Switch>
);

const AnalysisPage = props => (
  <Switch>
    <Route path={rt(props, '/')} exact component={AnalysisEventsViewContainer} />
    <Route path={rt(props, '/add')} exact component={AnalysisAddContainer} />
    <Route
      path={rt(props, '/edit/:analysisId')}
      exact
      component={AnalysisEditContainer}
    />
    <Route path={rt(props, '/:analysisId')} exact component={AnalysisViewContainer} />
    <Route
      path={rt(props, '/:analysisId/exchange')}
      exact
      component={AnalysisResultExchangeContainer}
    />
    <Route
      path={rt(props, '/sample/:objectId/add')}
      exact
      component={SampleFormAddContainer}
    />
    <Route
      path={rt(props, '/sample/:sampleId/fromSample')}
      exact
      component={SampleFormAddContainer}
    />
    <Route
      path={rt(props, '/sample/:sampleId/edit')}
      exact
      component={SampleEditContainer}
    />
    <Route path={rt(props, '/sample/:sampleId')} exact component={SampleViewContainer} />

    <Route component={NotFoundPage} />
  </Switch>
);

const AdministrationPage = props => (
  <Switch>
    <Route path={rt(props, '/')} exact component={Administration} />
    <Route path={rt(props, '/analysistypes')} exact component={AnalysisTypes} />
    <Route path={rt(props, '/analysisplaces')} exact component={AnalysisPlaces} />
    <Route path={rt(props, '/sampletypes')} exact component={SampleTypes} />

    <Route component={NotFoundPage} />
  </Switch>
);

const ReportsPage = props => (
  <Switch>
    <Route path={rt(props, '/')} exact component={Reports} />
    <Route path={rt(props, '/kdreport')} component={KDReportComponent} />

    <Route component={NotFoundPage} />
  </Switch>
);

const SearchPage = props => (
  <Switch>
    <Route path={rt(props, '/objects')} exact component={ObjectSearchContainer} />

    <Route component={NotFoundPage} />
  </Switch>
);

const NotFoundPage = props => <ScrollToTop><NotFound {...props} /></ScrollToTop>;

export default MusitRouter;
