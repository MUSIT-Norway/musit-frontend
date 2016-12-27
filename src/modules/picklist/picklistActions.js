import * as types from './picklistTypes';
import { apiUrl } from '../../util';
import Config from '../../config';
import MusitObject from '../../models/object';

// NODES Actions
export const clearNodes = () => ({ type: types.CLEAR_NODES });
export const addNode = (item, path = []) => ({ type: types.ADD_NODE, item, path });
export const removeNode = (item) => ({ type: types.REMOVE_NODE, item });
export const toggleNode = (item, on) => ({ type: types.TOGGLE_NODE, item, on });

// OBJECTS Actions
export const clearObjects = () => ({ type: types.CLEAR_OBJECTS });
export const addObject = (item, path = []) => ({ type: types.ADD_OBJECT, item: new MusitObject(item), path });
export const removeObject = (item) => ({ type: types.REMOVE_OBJECT, item });
export const toggleObject = (item, on) => ({ type: types.TOGGLE_OBJECT, item, on });
export const toggleMainObject = (item, on) => ({ type: types.TOGGLE_MAIN_OBJECT, item, on });


// Action for load node
export const refreshNode = (id, museumId) => {
  return {
    types: [types.LOAD_ONE_NODE, types.LOAD_ONE_NODE_SUCCESS, types.LOAD_ONE_NODE_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`)),
    id
  };
};

// Action for load object
export const refreshObject = (id, museumId) => {
  return {
    types: [types.LOAD_ONE_OBJECT, types.LOAD_ONE_OBJECT_SUCCESS, types.LOAD_ONE_OBJECT_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/currentlocation`)),
    id
  };
};