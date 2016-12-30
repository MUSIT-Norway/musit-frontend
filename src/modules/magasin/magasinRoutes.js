import React from 'react';
import { IndexRoute, Route } from 'react-router';

import MagasinContainer from './MagasinContainer';

const routes = (
  <Route>
    <IndexRoute component={MagasinContainer} />
    <Route path=":id/objects" showObjects component={MagasinContainer} />
    <Route path=":id" component={MagasinContainer} />
  </Route>
);

export default routes;