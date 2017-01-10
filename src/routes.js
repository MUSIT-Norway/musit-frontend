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

import * as path from './routes.path';

import Authenticated from './modules/app/Authenticated';
import LoginContainer from './modules/app/LoginContainer';
import PickListView from './modules/picklist/PicklistContainer';
import ReportsOverviewContainer from './modules/reports/ReportsOverviewContainer';
import ReportsKDContainer from './modules/reports/ReportsKDContainer';
import ObjectSearchContainer from './modules/search/SearchObjectContainer';

import Magasin from './modules/magasin/index';
import Storage from './modules/storage/index';
import Events from './modules/events/index';
import Control from './modules/control/index';
import Observation from './modules/observation/index';

const NotFound = () =>
  <div className="container">
    <h1>Not found! 404!</h1>
    <p>The route you are looking for does not exist!</p>
  </div>;

export default () => {
  return (
    <Route component={Authenticated}>
      <IndexRedirect to={path.ROUTE_SF} />
      <Route path={path.ROUTE_SF}>
        {Control.routes}
        {Observation.routes}
        {Events.routes}
        {Storage.routes}
        {Magasin.routes}
      </Route>
      <Route path={path.ROUTE_PICKLIST} component={PickListView} />
      <Route path={path.ROUTE_REPORTS}>
        <IndexRoute component={ReportsOverviewContainer} />
        <Route path={path.ROUTE_REPORTS_KDREPORT} component={ReportsKDContainer} />
      </Route>
      <Route path={path.ROUTE_SEARCH_OBJECTS} component={ObjectSearchContainer} />
      <Route path="/" component={LoginContainer} />
      -- Catch all route
      <Route path="/*" component={NotFound} status={404} />
    </Route>
  );
};
