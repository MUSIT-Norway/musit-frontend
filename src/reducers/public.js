export const getState = (id, field) => global.reduxStore.getState()[id][field];

export const dispatchAction = (action) => global.reduxStore.dispatch(action);

export const DISPATCH_START = 'musit/dispatch/start';
export const DISPATCH_SUCCESS = 'musit/dispatch/success';
export const DISPATCH_FAILURE = 'musit/dispatch/failure';