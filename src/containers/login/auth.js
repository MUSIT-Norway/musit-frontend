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

 import { clearUser as cl, connectUser, clearActor, loadActor } from '../../reducers/auth';
 import jwtDecode from 'jwt-decode';

 export const loadUser = (dispatch) => {
   if (localStorage.getItem('jwtToken')) {
     const user = jwtDecode(localStorage.getItem('jwtToken'))
     dispatch(connectUser(user));
     dispatch(loadActor())
     return true;
   }
   if (localStorage.getItem('fakeToken')) {
     const userId = JSON.parse(localStorage.getItem('fakeToken')).userId
     const user = require('../../../fake_security.json').users.find(u => u.userId === userId)
     dispatch(connectUser(user))
     dispatch(loadActor())
     return true;
   }
   return false;
 }

 export const clearUser = (dispatch) => {
   localStorage.removeItem('jwtToken')
   localStorage.removeItem('fakeToken')
   dispatch(cl())
   dispatch(clearActor())
 }

 export const setUser = (dispatch, props, user) => {
   dispatch(connectUser(user))
   dispatch(loadActor())
   props.history.push('/musit')
 }
