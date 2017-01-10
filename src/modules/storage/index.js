import reducer from './storageReducers';
import * as actions from './storageActions';
import routes from './storageRoutes.js';

const api = {
  reducer,
  actions,
  routes
};

export default api;