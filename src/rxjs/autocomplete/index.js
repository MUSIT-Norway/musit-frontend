import { connect, createState } from '../RxState';

import createActions from './actions';
import createReducer from './reducer';

const autoComplete = (urlTemplate) => (Component) => {
  const actions = createActions(urlTemplate);
  const reducer$ = createReducer(actions);
  return connect(state => ({
    suggest: state.data,
    update: (update) => {
      const value = update.value;
      if (value.length > 2) {
        actions.input$.next(value);
      } else {
        actions.clear$.next();
      }
    },
    clear: () => actions.clear$.next()
  }))(createState(reducer$))(Component);
};

export default autoComplete;