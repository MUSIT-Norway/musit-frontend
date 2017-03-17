/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';
import NotFound from './components/NotFound';
import AboutView from './modules/about/AboutPage';
import PickListView from './modules/picklist/PickListContainer';
import StorageUnitsTable from './modules/storagefacility/TableComponent';
import KDReportComponent from './modules/reports/KDReportComponent';
import AddStorageUnitPanel from './modules/storagefacility/AddNodeComponent';
import EditStorageUnitPanel from './modules/storagefacility/EditNodeComponent';
import AddObservationPage from './modules/observation/AddObservationPage';
import EditObservationPage from './modules/observation/EditObservationPage';
import ViewObservationPage from './modules/observation/ViewObservationPage';
import Reports from './modules/reports/ReportsOverview';
import ControlViewContainer from './modules/control/ControlViewComponent';
import ControlAddContainer from './modules/control/ControlAddComponent';
import EventsContainer from './modules/events/EventsComponent';
import ObjectSearchComponent from './modules/objectsearch/ObjectSearchComponent';
import AppComponent from './modules/app/AppComponent';
import AnalysisAddContainer from './modules/analysis/analysisAddContainer';
import SampleFormAddContainer  from './modules/sample/sampleAddContainer';
import CenteredLayout from './components/layout/CenteredLayout';

export default () => {
  return (
    <Route>
      <Route path="/(museum/:museumId/)(collections/:collectionIds/)" component={AppComponent}>
        <IndexRedirect to="magasin" />
        <Route path="magasin">
          <IndexRoute component={StorageUnitsTable} />
          <Route path="add" add component={AddStorageUnitPanel} />
          <Route path=":id/add" add component={AddStorageUnitPanel} />
          <Route path=":id/view" component={EditStorageUnitPanel} />
          <Route path=":id/controls" showControls showObservations={false} component={EventsContainer} />
          <Route path=":id/controlsobservations" showObservations showControls component={EventsContainer} />
          <Route path=":id/control/add" component={ControlAddContainer} />
          <Route path=":id/control/:controlId" component={ControlViewContainer} />
          <Route path=":id/observations" showObservations showControls={false} component={EventsContainer} />
          <Route path=":id/observation/add" component={AddObservationPage} />
          <Route path=":id/observation/edit" component={EditObservationPage} />
          <Route path=":id/observation/:obsId" component={ViewObservationPage} />
          <Route path=":id/objects" showObjects component={StorageUnitsTable} />
          <Route path=":id" component={StorageUnitsTable} />
        </Route>
        <Route component={CenteredLayout}>
          <Route path="analysis/sample/add" component={SampleFormAddContainer}/>
          <Route path="analysis/add" component={AnalysisAddContainer} />
        </Route>
        <Route path="picklist">
          <Route path="nodes" type="nodes" component={PickListView} />
          <Route path="objects" type="objects" component={PickListView} />
        </Route>
        <Route path="reports">
          <IndexRoute component={Reports} />
          <Route path="kdreport" component={KDReportComponent} />
        </Route>
        <Route path="search/objects" component={ObjectSearchComponent} />
        <Route path="about" component={AboutView} />
        -- Catch all route
        <Route path="*" component={NotFound} status={404} />
      </Route>
    </Route>

  );
};
