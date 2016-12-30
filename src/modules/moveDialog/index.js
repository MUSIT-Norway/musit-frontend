import React from 'react';
import reducer from './moveDialogReducers';
import * as actions from './moveDialogActions';
import * as selectors from './moveDialogReducers';
import MoveModal from './MoveDialogContainer';

const getDialog = (onMove) => <MoveModal onMove={onMove} />;

const api = {
  reducer,
  actions,
  selectors,
  getDialog
};

export default api;