import { connect, createState } from '../RxState';

import createActions from './actions';
import createReducer from './reducer';

export default (urlTemplate) => (Component) => {
  const actions = createActions(urlTemplate);
  const reducer$ = createReducer(actions);
  return connect(state => ({
    suggest: state.data,
    update: (n) => actions.input$.next(n), // async
    clear: () => actions.clear$.next()
  }))(createState(reducer$))(Component);
};