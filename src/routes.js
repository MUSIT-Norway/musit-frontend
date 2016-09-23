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

import React from 'react'
import { Route } from 'react-router'
import NotFound from './components/NotFound'
import WelcomeView from './containers/login'
import StorageUnitsTable from './containers/magasin/grid'
import PickListView from './containers/picklist'
import AddStorageUnitPanel from './containers/magasin/panel/add'
import EditStorageUnitPanel from './containers/magasin/panel/edit'
import WelcomeUserView from './containers/welcome-user'
import AddObservationPage from './containers/observation/add'
import EditObservationPage from './containers/observation/edit'
import ViewObservationPage from './containers/observation/view'
import ControlViewContainer from './containers/control/view/Connect'
import ControlAddContainer from './containers/control/add/Connect'
import App from './containers/app'
import ObservationControlGridShow from './containers/observationcontrol/grid'

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    const { auth: { user } } = store.getState();
    if (!user) {
      replace('/');
    }
    cb();
  };
  return (
    <Route component={App}>
      <Route path="/" component={WelcomeView} />
      <Route
        path="/picklist"
        component={PickListView}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin"
        component={StorageUnitsTable}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/root"
        component={StorageUnitsTable}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/add"
        add component={AddStorageUnitPanel}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:parentId/add"
        add component={AddStorageUnitPanel}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/view"
        component={EditStorageUnitPanel}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/controls"
        showControls showObservations={false}
        component={ObservationControlGridShow}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/control/add"
        component={ControlAddContainer}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/control/:controlId"
        component={ControlViewContainer}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/observations"
        showObservations showControls={false}
        component={ObservationControlGridShow}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/controlsobservations"
        showObservations showControls
        component={ObservationControlGridShow}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/observation/add"
        component={AddObservationPage}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/observation/edit"
        component={EditObservationPage}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/:id/observation/:obsId"
        component={ViewObservationPage}
        onEnter={requireLogin}
      />
      <Route
        path="/magasin/*"
        component={StorageUnitsTable}
        onEnter={requireLogin}
      />
      <Route
        path="/musit"
        component={WelcomeUserView}
      />

      -- Catch all route
      <Route
        path="/*"
        component={NotFound}
        status={404}
      />
    </Route>

  );
};
