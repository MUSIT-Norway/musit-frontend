import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import TaxonClassification from './TaxonClassification';
import { flowRight } from 'lodash';
import { History } from 'history';
import appSession$ from '../../../stores/appSession';
import { AppSession } from '../../../types/appSession';

const store$ = createStore(
  'store',
  Observable.combineLatest(appSession$, (appSession: AppSession) => () => ({
    appSession
  }))
);

const props = (store: any, upstream: { history: History }) => ({
  ...upstream,
  ...store
});

export default flowRight([inject(store$, props)])(TaxonClassification);
