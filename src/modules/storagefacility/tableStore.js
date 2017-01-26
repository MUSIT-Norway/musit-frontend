import { Observable } from 'rxjs';
import { createStore } from '../../rxjs/RxStore';
import MusitObject from '../../shared/models/object';
import { getPath } from '../../shared/util';
import * as actions from './tableActions';

export const reducer$ = ({ clearRootNode$, deleteNode$, loadStats$, loadRootNode$, setLoading$, loadChildren$ }) =>
  Observable.empty().merge(
    clearRootNode$.map(() => () => {
      return { rootNode: null, stats: null };
    }),
    deleteNode$.map(() => (state) => state),
    loadStats$.map((stats) => (state) => ({
      ...state,
      stats
    })),
    loadRootNode$.map((rootNode) => (state) => ({
      ...state,
      rootNode: {
        ...rootNode,
        breadcrumb: getPath(rootNode)
      }
    })),
    setLoading$.map(() => state => ({
      ...state,
      children: { data: null, loading: true }
    })),
    loadChildren$.map((data) => (state) => ({
      ...state,
      children: {
        data: {
          ...data,
          matches: Array.isArray(data) ? data : data.matches.map(o => o.term ? new MusitObject(o) : o)
        },
        loading: false
      }
    }))
  );

export default createStore(reducer$(actions));
