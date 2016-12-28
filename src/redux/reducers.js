/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import app from '../modules/app/appReducers';
import picklist from '../modules/picklist/picklistReducers';
import storage from '../modules/storage/storageReducers';
import magasin from '../modules/magasin/magasinReducers';
import reports from '../modules/reports/reportsReducers';
import search from '../modules/search/searchReducers';
import observation from '../modules/observation/observationReducers';
import events from '../modules/events/eventsReducers';
import print from '../modules/print/printReducer';
import control from '../modules/control/controlReducer';
import moveHistory from '../modules/moveHistory/moveHistoryReducers';
import moveDialog from '../modules/moveDialog/moveDialogReducers';

const rootReducer = combineReducers({
  routing,
  app,
  magasin,
  moveDialog,
  moveHistory,
  observation,
  picklist,
  storage,
  control,
  reports,
  search,
  events,
  print
});

export default rootReducer;

export const getState = () => global.reduxStore.getState();
export const dispatch = (action) => global.reduxStore.dispatch(action);