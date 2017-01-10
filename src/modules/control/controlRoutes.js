import React from 'react';
import { Route } from 'react-router';

import ControlViewContainer from './ControlViewContainer';
import ControlAddContainer from './ControlAddContainer';

const routes = (
  <Route>
    <Route path=":id/control/add" component={ControlAddContainer} />
    <Route path=":id/control/:controlId" component={ControlViewContainer} />
  </Route>
);

export default routes;