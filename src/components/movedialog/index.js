
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
import { loadChildren, clear, loadNode } from '../../reducers/storageunit/modal';
import { connect } from 'react-redux';
import MusitModalImpl from './MusitModal';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import {customSortingStorageNodeType} from '../../util/';

const getStorageGridUnit = (state) => state.storageUnitModal.data || [];

const getSortedStorageGridUnit = createSelector(
  [ getStorageGridUnit ],
  (storageGridUnit) => orderBy(storageGridUnit, [(o) => customSortingStorageNodeType(o.type), (o) => toLower(o.name)])
);


const mapStateToProps = (state) => ({
  user: state.auth.user,
  children: getSortedStorageGridUnit(state),
  selectedNode: state.storageUnitModal.root.data
});

const mapDispatchToProps = (dispatch) => {
  return {
    clear: () => dispatch(clear()),
    loadNode: (id, museumId) => dispatch(loadNode(id, museumId)),
    loadRootChildren: (museumId) => dispatch(loadChildren(null, museumId)),
    loadChildren: (id, museumId) => dispatch(loadChildren(id, museumId))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(MusitModalImpl);
