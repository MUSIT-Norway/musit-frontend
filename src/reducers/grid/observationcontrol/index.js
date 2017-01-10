import Config from '../../../config';
import { apiUrl } from '../../../util';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import Actor from '../../../models/actor';

export const LOAD = 'musit/observationcontrol/LOAD';
export const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS';
export const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL';

const initialState = { data: [] };

const observationControlGridReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOAD:
    return {
      ...state,
      loading: true,
      loaded: false
    };
  case LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  default:
    return state;
  }
};

export const loadControlsAndObservationsForNode = (id, museumId, callback) => {
  console.log(id);
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}/events`))
        .then(rows => {
          console.log(rows);
          client.post(apiUrl(`${Config.magasin.urls.actor.baseUrl}/details`), {
            data: uniq(flatten(rows.map(r => [r.doneBy, r.registeredBy])))
          }).then(actors => {
            console.log(actors);
            resolve(
              rows.map((data) => ({
                ...data,
                ...Actor.getActorNames(actors, data.doneBy, data.registeredBy)
              }))
            );
          }).catch(error => reject(error));
        }).catch(error => reject(error));
    }),
    callback
  };
};

export default observationControlGridReducer;
