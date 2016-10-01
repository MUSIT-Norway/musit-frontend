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

import App from './containers/app'

export const createRoutes = () => ({
  component: App,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/welcome-view'))
        }, 'WelcomeView')
      }
    },
    {
      path: '/picklist/:type',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/picklist'))
        }, 'PickList')
      }
    },
    {
      path: '/magasin/root',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/magasin/grid'))
        }, 'MagasinGrid')
      }
    },
    {
      path: '/magasin/:parentId/add',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/magasin/panel/add'))
        }, 'MagasinAdd')
      }
    },
    {
      path: '/magasin/:id/view',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/magasin/panel/edit'))
        }, 'MagasinView')
      }
    },
    {
      path: '/magasin/:id/control/add',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/control/add/Connect'))
        }, 'ControlAdd')
      }
    },
    {
      path: '/magasin/:id/control/:controlId',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/control/view/Connect'))
        }, 'ControlView')
      }
    },
    {
      path: '/magasin/:id/controls',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observationcontrol/grid'))
        }, 'MagasinControls')
      },
      showObservations: false,
      showControls: true
    },
    {
      path: '/magasin/:id/observation/add',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observation/add'))
        }, 'ObservationAdd')
      }
    },
    {
      path: '/magasin/:id/observation/edit',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observation/edit'))
        }, 'ObservationEdit')
      }
    },
    {
      path: '/magasin/:id/observation/:observationId',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observation/view'))
        }, 'ObservationView')
      }
    },
    {
      path: '/magasin/:id/observations',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observationcontrol/grid'))
        }, 'MagasinObservations')
      },
      showObservations: true,
      showControls: false
    },
    {
      path: '/magasin/:id/controlsobservations',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/observationcontrol/grid'))
        }, 'MagasinEvents')
      },
      showObservations: true,
      showControls: true
    },
    {
      path: '/magasin/*',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/magasin/grid'))
        }, 'MagasinWilcard')
      }
    }
  ]
})

export default createRoutes
