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

import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import auth from './auth';

import picklistReducers from '../modules/picklist/picklistReducers';
import storageReducers from '../modules/storage/storageReducers';
import magasinReducers from '../modules/magasin/magasinReducers';
import reportReducer from '../modules/reports/reportsReducers';
import ObjectSearchReducer from '../modules/search/searchReducers';
import observationReducers from '../modules/observation/observationReducers';
import observationControlGridReducer from '../modules/events/eventsReducers';
import printReducer from '../modules/print/printReducer';
import controlReducer from '../modules/control/controlReducer';
import moveHistoryReducer from '../modules/moveHistory/moveHistoryReducers';
import moveDialogReducer from '../modules/moveDialog/moveDialogReducers';

const rootReducer = combineReducers({
  magasinReducers,
  routing: routerReducer,
  [auth.ID]: auth.reducer,
  print: printReducer,
  picks: picklistReducers,
  storagePanelUnit: storageReducers,
  [moveDialogReducer.ID]: moveDialogReducer.reducer,
  observation: observationReducers,
  reports: reportReducer,
  control: controlReducer,
  observationControlGrid: observationControlGridReducer,
  movehistory: moveHistoryReducer,
  objectSearch: ObjectSearchReducer
});

export default rootReducer;
