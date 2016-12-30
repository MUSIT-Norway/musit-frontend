import React from 'react';
import reducer from './moveHistoryReducers';
import * as actions from './moveHistoryReducers';
import HistoryModal from './MoveHistoryContainer';

const getDialog = (objectId) => <HistoryModal objectId={objectId} />;

const api = {
  reducer,
  actions,
  getDialog
};

export default api;