
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
import PickListContainer from '../../components/picklist/PickListContainer';
import { connect } from 'react-redux';
import { refreshObject, refreshNode, toggleMainObject, toggleNode, toggleObject, removeNode, removeObject } from '../../reducers/picklist';
import { moveObject, moveNode } from '../../reducers/move';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import {customSortingStorageNodeType} from '../../util/';

const getNodes = (state) => state.picks.NODE || [];

const getSortedNodes = createSelector(
    [ getNodes ],
    (nodes) => orderBy(nodes, [(o) => customSortingStorageNodeType(o.value.type), (o) => toLower(o.value.name)])
);


const getObjects = (state) => state.picks.OBJECT || [];

const getSortedObjects = createSelector(
    [ getObjects ],
    (objects) => orderBy(objects, [(o) => toLower(o.value.museumNo), (o) => toLower(o.value.subNo), (o) => toLower(o.value.term)])
);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  picks: {
    NODE: getSortedNodes(state) ,
    OBJECT: getSortedObjects(state)
  },
  rootNode: state.storageGridUnit
});

const mapDispatchToProps = (dispatch) => ({
  toggleNode: (item, on) => dispatch(toggleNode(item, on)),
  toggleObject: (item, on) => {
    if (item.mainObjectId && item.isMainObject()) {
      dispatch(toggleMainObject(item, on));
    } else {
      dispatch(toggleObject(item, on));
    }
  },
  removeNode: (item) => dispatch(removeNode(item)),
  removeObject: (item) => dispatch(removeObject(item)),
  moveObject: (objectId, destinationId, doneBy, museumId, callback) => {
    dispatch(moveObject(objectId, destinationId, doneBy, museumId, callback));
  },
  moveNode: (nodeId, destinationId, doneBy, museumId, callback) => {
    dispatch(moveNode(nodeId, destinationId, doneBy, museumId, callback));
  },
  refreshNodes: (ids, museumId) => ids.forEach(id => dispatch(refreshNode(id, museumId))),
  refreshObjects: (ids, museumId) => ids.forEach(id => dispatch(refreshObject(id, museumId)))
});

export default connect(mapStateToProps, mapDispatchToProps)(PickListContainer);
