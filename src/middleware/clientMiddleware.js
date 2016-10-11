/* @flow */
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

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, callback, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      if (!types) {
        throw Error('This middleware needs a field "types" of string[]. Ex. { types: [LOAD, LOAD_SUCCESS, lOAD_FAIL] }')
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ ...rest, type: REQUEST });

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          next({ ...rest, result, type: SUCCESS })
          if (callback) {
            const { onSuccess } = callback
            if (typeof onSuccess === 'function') onSuccess(result)
          }
        },
        (error) => {
          next({ ...rest, error, type: FAILURE })
          if (callback) {
            const { onFailure } = callback
            if (typeof onFailure === 'function') onFailure(error)
          }
        }
      ).catch((error) => {
        next({ ...rest, error, type: FAILURE });
        if (callback) {
          const { onFailure } = callback
          if (typeof onFailure === 'function') onFailure(error)
        }
      });

      return actionPromise;
    };
  };
}
