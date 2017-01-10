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
import AboutView from './components/about-view';
import StorageUnitsTable from './containers/magasin/grid';
import PickListView from './containers/picklist';
import AddStorageUnitPanel from './containers/magasin/panel/add';
import EditStorageUnitPanel from './containers/magasin/panel/edit';
import AddObservationPage from './containers/observation/add';
import EditObservationPage from './containers/observation/edit';
import ViewObservationPage from './containers/observation/view';
import Reports from './containers/reports';
import KDReportContainer from './containers/reports/reportkd';
import ControlViewContainer from './containers/control/view';
import ControlAddContainer from './containers/control/add';
import ObservationControlGridShow from './containers/observationcontrol';
import ObjectSearchContainer from './containers/objectsearch';
import Authenticated from './components/Authenticated';
import * as path from './routes.path';

export default () => {
  return (
    <Route path="/" component={Authenticated}>
      <IndexRedirect to={path.ROUTE_SF} />
      <Route path={path.ROUTE_SF}>
        <IndexRoute component={StorageUnitsTable} />
        <Route path={path.ROUTE_SF_ADD} add component={AddStorageUnitPanel} />
        <Route path={path.ROUTE_SF_NODE_ADD} add component={AddStorageUnitPanel} />
        <Route path={path.ROUTE_SF_NODE_VIEW} component={EditStorageUnitPanel} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS} showControls showObservations={false} component={ObservationControlGridShow} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_AND_OBSERVATIONS} showObservations showControls component={ObservationControlGridShow} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_ADD} component={ControlAddContainer} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_VIEW} component={ControlViewContainer} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS} showObservations showControls={false} component={ObservationControlGridShow} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_ADD} component={AddObservationPage} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_EDIT} component={EditObservationPage} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_VIEW} component={ViewObservationPage} />
        <Route path={path.ROUTE_SF_OBJECTS} showObjects component={StorageUnitsTable} />
        <Route path={path.ROUTE_SF_NODE} component={StorageUnitsTable} />
      </Route>
      <Route path={path.ROUTE_PICKLIST} component={PickListView} />
      <Route path={path.ROUTE_REPORTS} component={Reports} />
      <Route path={path.ROUTE_REPORTS_KDREPORT} component={KDReportContainer} />
      <Route path={path.ROUTE_SEARCH_OBJECTS} component={ObjectSearchContainer} />
      <Route path="/about" component={AboutView} />
      -- Catch all route
      <Route path="/*" component={NotFound} status={404} />
    </Route>
  );
};
