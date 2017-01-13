
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
import request from 'superagent';
import { getAccessToken } from '../components/appReducer';

const methods = ['get', 'post', 'put', 'patch', 'del'];

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const apiRequest = request[method](this.fixPath(path));
        if (params) {
          apiRequest.query(params);
        }
        const token = getAccessToken();
        if (token !== '') {
          apiRequest.set('Authorization', `Bearer ${token}`);
        }
        if (data) {
          apiRequest.send(data);
        }
        apiRequest.end((error, response) => error ? reject({ error, response }) : resolve(response.body || response.text));
      });
    });
  }

  fixPath(path) {
    if (path.charAt(0) === '') {
      return `/${path}`;
    }
    return path;
  }

}

export default ApiClient;
