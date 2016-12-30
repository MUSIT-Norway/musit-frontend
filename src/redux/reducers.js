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

import App from '../modules/app/index';
import Observation from '../modules/observation/index';
import Magasin from '../modules/magasin/index';
import Storage from '../modules/storage/index';
import Control from '../modules/control/index';
import Events from '../modules/events/index';
import moveHistory from '../modules/moveHistory/moveHistoryReducers';
import moveDialog from '../modules/moveDialog/moveDialogReducers';
import picklist from '../modules/picklist/picklistReducers';
import reports from '../modules/reports/reportsReducers';
import search from '../modules/search/searchReducers';
import print from '../modules/print/printReducer';

const rootReducer = combineReducers({
  app: App.reducer,
  observation: Observation.reducer,
  magasin: Magasin.reducer,
  storage: Storage.reducer,
  control: Control.reducer,
  events: Events.reducer,
  moveHistory,
  moveDialog,
  picklist,
  reports,
  search,
  print,
  routing
});

export default rootReducer;