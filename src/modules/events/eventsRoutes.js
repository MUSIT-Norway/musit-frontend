import React from 'react';
import { Route } from 'react-router';

import ObservationControlGridShow from './EventsContainer';

const routes = (
  <Route path=":id/events" showObservations showControls component={ObservationControlGridShow} />
);

export default routes;