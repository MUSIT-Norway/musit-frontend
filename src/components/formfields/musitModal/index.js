
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

import { I18n } from 'react-i18nify'
import { loadRoot, clearRoot, loadChildren, setCurrent, clearCurrent, clearPath } from '../../../reducers/storageunit/modal'
import { connect } from 'react-redux'
import { createBreadcrumbPath } from '../../../util'
import MusitModalImpl from './MusitModal'

const mapStateToProps = (state) => ({
  user: state.auth.user,
  translate: (key, markdown) => I18n.t(key, markdown),
  children: state.storageUnitModal.data || [],
  path: state.storageUnitModal.root.data ?
    createBreadcrumbPath(state.storageUnitModal.root.data.path, state.storageUnitModal.root.data.pathNames) : [],
  rootNode: state.storageUnitModal.root,
  currentId: state.storageUnitModal.currentId
});

const mapDispatchToProps = (dispatch) => {
  return ({
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback));
      dispatch(loadRoot(id))
    },
    clearRoot: () => dispatch(clearRoot()),
    clearPath: (id) => dispatch(clearPath(id)),
    loadRoot: () => dispatch(loadRoot()),
    setCurrentId: (id) => dispatch(setCurrent(id)),
    clearCurrentId: (id) => dispatch(clearCurrent(id))
  })
};


export default connect(mapStateToProps, mapDispatchToProps)(MusitModalImpl)
