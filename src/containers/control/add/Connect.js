
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
import { connect } from 'react-redux'
import { addControl } from '../../../reducers/control'
import { I18n } from 'react-i18nify'
import ControlAddContainerImpl from './index'
import { createBreadcrumbPath } from '../../../util'

const mapStateToProps = (state) => ({
  actor: state.auth.actor,
  translate: (key, markdown) => I18n.t(key, markdown),
  envReqData: state.storageGridUnit.root.data ? state.storageGridUnit.root.data.environmentRequirement : null,
  path: createBreadcrumbPath(state.storageGridUnit.root.data.path, state.storageGridUnit.root.data.pathNames)
})

const mapDispatchToProps = (dispatch) => ({
  saveControl: (id, data, saveControlCallback) => {
    dispatch(addControl(id, data, {}, saveControlCallback))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlAddContainerImpl)
