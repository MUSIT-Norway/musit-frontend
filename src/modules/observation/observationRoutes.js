import React from 'react';
import { Route } from 'react-router';

import AddObservationPage from './ObservationAddContainer';
import EditObservationPage from './ObservationEditContainer';
import ViewObservationPage from './ObservationViewContainer';

const routes = (
  <Route>
    <Route path=":id/observation/add" component={AddObservationPage} />
    <Route path=":id/observation/edit" component={EditObservationPage} />
    <Route path=":id/observation/:obsId" component={ViewObservationPage} />
  </Route>
);

export default routes;