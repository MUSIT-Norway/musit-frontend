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

import Language from '../../../components/language'
import { loadRoot, loadChildren, loadPath, setCurrent, clearCurrent, clearPath } from '../../../reducers/storageunit/modal'
import { connect } from 'react-redux';
import MusitModalImpl from './musitModal'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  children: state.storageUnitModal.data || [],
  path: state.storageUnitModal.root.path,
  currentId: state.storageUnitModal.currentId
})

const mapDispatchToProps = (dispatch) => {
  return ({
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback))
      dispatch(loadRoot(id))
    },
    loadPath: (id) => dispatch(loadPath(id)),
    clearPath: (id) => dispatch(clearPath(id)),
    loadRoot: () => dispatch(loadRoot()),
    setCurrentId: (id) => dispatch(setCurrent(id)),
    clearCurrentId: (id) => dispatch(clearCurrent(id))
  })
}


@connect(mapStateToProps, mapDispatchToProps)
export default class MusitModal extends MusitModalImpl {}
