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
import NotFound from './core/components/NotFound';
import WelcomeView from './core/containers/welcome-view';

import PickListView from './picklist/PicklistContainer';
import MagasinContainer from './magasin/MagasinContainer';
import StorageAddContainer from './storage/StorageAddContainer';
import StorageEditContainer from './storage/StorageEditContainer';
import ControlViewContainer from './control/ControlViewContainer';
import ControlAddContainer from './control/ControlAddContainer';
import ReportsOverviewContainer from './reports/ReportsOverviewContainer';
import ReportsKDContainer from './reports/ReportsKDContainer';
import ObjectSearchContainer from './search/SearchObjectContainer';
import AddObservationPage from './observation/ObservationAddContainer';
import EditObservationPage from './observation/ObservationEditContainer';
import ViewObservationPage from './observation/ObservationViewContainer';
import ObservationControlGridShow from './events/EventsContainer';

import Authenticated from './core/components/Authenticated';
import * as path from './routes.path';

export default () => {
  return (
    <Route component={Authenticated}>
      <IndexRedirect to={path.ROUTE_SF} />
      <Route path={path.ROUTE_SF}>
        <IndexRoute component={MagasinContainer} />
        <Route path={path.ROUTE_SF_ADD} add component={StorageAddContainer} />
        <Route path={path.ROUTE_SF_NODE_ADD} add component={StorageAddContainer} />
        <Route path={path.ROUTE_SF_NODE_VIEW} component={StorageEditContainer} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_AND_OBSERVATIONS} showObservations showControls component={ObservationControlGridShow} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_ADD} component={ControlAddContainer} />
        <Route path={path.ROUTE_SF_NODE_CONTROLS_VIEW} component={ControlViewContainer} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_ADD} component={AddObservationPage} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_EDIT} component={EditObservationPage} />
        <Route path={path.ROUTE_SF_NODE_OBSERVATIONS_VIEW} component={ViewObservationPage} />
        <Route path={path.ROUTE_SF_OBJECTS} showObjects component={MagasinContainer} />
        <Route path={path.ROUTE_SF_NODE} component={MagasinContainer} />
      </Route>
      <Route path={path.ROUTE_PICKLIST} component={PickListView} />
      <Route path={path.ROUTE_REPORTS}>
        <IndexRoute component={ReportsOverviewContainer} />
        <Route path={path.ROUTE_REPORTS_KDREPORT} component={ReportsKDContainer} />
      </Route>
      <Route path={path.ROUTE_SEARCH_OBJECTS} component={ObjectSearchContainer} />
      <Route path="/" component={WelcomeView} />

      -- Catch all route
      <Route path="/*" component={NotFound} status={404} />
    </Route>
  );
};
