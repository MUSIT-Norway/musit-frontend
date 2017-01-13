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
import auth from '../modules/app/appReducer';
import picklistReducer from '../modules/picklist/picklistReducer';
import storagePanelStateReducer from '../modules/storagefacility/reducers/panel/state';
import storagePanelReducer from '../modules/storagefacility/reducers/panel';
import storageNodeGridReducer from '../modules/storagefacility/reducers/grid/nodes';
import storageUnitModal from '../modules/storagefacility/reducers/modal';
import storageUnitStatsReducer from '../modules/storagefacility/reducers/stats';
import storageObjectGridReducer from '../modules/storagefacility/reducers/grid/objects';
import observationReducer from '../modules/observation/observationReducer';
import reportReducer from '../modules/reports/reportsReducer';
import controlReducer from '../modules/control/controlReducer';
import observationControlGridReducer from '../modules/events/eventsReducer';
import moveHistoryReducer from '../modules/movehistory/moveHistoryReducer';
import ObjectSearchReducer from '../modules/objectsearch/reducer';
import printReducer from '../modules/print/printReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  [auth.ID]: auth.reducer,
  print: printReducer,
  picks: picklistReducer,
  storagePanelUnit: storagePanelReducer,
  storageGridUnit: storageNodeGridReducer,
  [storageUnitModal.ID]: storageUnitModal.reducer,
  storageUnitStats: storageUnitStatsReducer,
  storagePanelState: storagePanelStateReducer,
  storageObjectGrid: storageObjectGridReducer,
  observation: observationReducer,
  reports: reportReducer,
  control: controlReducer,
  observationControlGrid: observationControlGridReducer,
  movehistory: moveHistoryReducer,
  objectSearch: ObjectSearchReducer
});

export default rootReducer;
