import reducer from './magasinReducers';
import * as actions from './magasinActions';
import * as selectors from './magasinSelectors';
import routes from './magasinRoutes';

const api = {
  reducer,
  actions,
  selectors,
  routes
};

export default api;