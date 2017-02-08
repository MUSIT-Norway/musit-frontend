import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import Control from '../../models/control';

export const addControl = ({ simpleGet }) => (cmd) => {
  return Control.addControl(simpleGet)(cmd.nodeId, cmd.controlData, cmd.observations, cmd.museumId, cmd.controlId, cmd.token, cmd);
};

export const getControl = ({ simpleGet }) => (cmd) => {
  const result = Control.getControl(simpleGet)(cmd.nodeId, cmd.controlId, cmd.museumId, cmd.token, cmd);
  return result;
};

export const addControl$ = createAction('addControl$').switchMap(addControl(ajax));
export const getControl$ = createAction('getControl$').switchMap(getControl(ajax));


export const initialState = {};

export const reducer$ = (actions) => Observable.merge(
  /*
  actions.addControl$.map(() => (state) => {
    return {
      ...state
    }
  }),  */
  actions.getControl$.map((result) => (state) => {
    return {
      ...state,
      data: result
    };
  })
);

export default createStore('controlStore$', reducer$({
  addControl$,
  getControl$
}), Observable.of(initialState));
