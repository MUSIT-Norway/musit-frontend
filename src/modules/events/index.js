import reducer from './eventsReducers';
import * as actions from './eventsReducers';
import routes from './eventsRoutes.js';

const api = {
  reducer,
  actions,
  routes
};

export default api;