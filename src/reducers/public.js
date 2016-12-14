export const getState = (id, field) => global.reduxStore.getState()[id][field];

const DISPATCH_START = 'musit/dispatch/start';
const DISPATCH_SUCCESS = 'musit/dispatch/success';
const DISPATCH_FAILURE = 'musit/dispatch/failure';

export const dispatchAction = (action) => global.reduxStore.dispatch({
  types: [ DISPATCH_START, DISPATCH_SUCCESS, DISPATCH_FAILURE ],
  ...action
});