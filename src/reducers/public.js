export const getState = (id, field) => global.reduxStore.getState()[id][field];
export const dispatchAction = (action) => global.reduxStore.dispatch(action);