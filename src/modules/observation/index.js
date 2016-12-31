import reducer from './observationReducers';
import * as actions from './observationReducers';
import routes from './observationRoutes';
import * as render from './render/index';

const api = {
  reducer,
  actions,
  routes,
  render
};

export default api;