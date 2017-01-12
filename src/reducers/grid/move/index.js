import Config from '../../../config';
import { apiUrl } from '../../../util';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { getPath } from '../../helper';
import Actor from '../../../models/actor';
import { I18n } from 'react-i18nify';

export const LOAD = 'musit/movehistory/LOAD';
export const LOAD_SUCCESS = 'musit/movehistory/LOAD_SUCCESS';
export const LOAD_FAIL = 'musit/movehistory/LOAD_FAIL';
export const CLEAR_SUCCESS = 'musit/movehistory/CLEAR_SUCCESS';

const initialState = { data:[] };

const moveHistoryReducer = (state = initialState, action) => {
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
      data: action.result.map(data => {
        return {
          ...data,
          from: {
            ...data.from,
            breadcrumb: getPath(data.from)
          },
          to: {
            ...data.to,
            breadcrumb: getPath(data.to)
          }
        };
      })
    };
  case LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.error

    };
  case CLEAR_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: action.result
    };
  default:
    return state;
  }
};

export default moveHistoryReducer;

export const loadMoveHistoryForObject = (id, museumId, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/locations`))
        .then(rows => {
          const actorIds = uniq(rows.map(r => r.doneBy)).filter(r => r);
          if (actorIds.length === 0) {
            resolve(rows);
          } else {
            client.post(apiUrl(`${Config.magasin.urls.actor.baseUrl}/details`), {
              data: actorIds
            }).then(actorsJson => {
              const actors = actorsJson.map(a => new Actor(a));
              resolve(
                rows.map((data) => {
                  const doneBy = actors.find(a => a.hasActorId(data.doneBy));
                  return {
                    ...data,
                    doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown')
                  };
                })
              );
            }).catch(error => reject(error));
          }
        }).catch(error => reject(error));
    }),
    callback
  };
};

export const clearMoveHistoryForObject = () => {
  return {
    type: CLEAR_SUCCESS,
    result: []
  };
};
