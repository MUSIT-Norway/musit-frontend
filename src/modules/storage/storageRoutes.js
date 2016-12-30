import React from 'react';
import { Route } from 'react-router';

import StorageAddContainer from './StorageAddContainer';
import StorageEditContainer from './StorageEditContainer';

const routes = (
  <Route>
    <Route path="add" add component={StorageAddContainer} />
    <Route path=":id/add" add component={StorageAddContainer} />
    <Route path=":id/view" component={StorageEditContainer} />
  </Route>
);

export default routes;