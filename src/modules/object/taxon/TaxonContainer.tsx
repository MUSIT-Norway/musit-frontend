import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import * as TaxonClassification from './TaxonClassification';
import { flowRight } from 'lodash';
import appSession$ from '../../../stores/appSession';
import { AppSession } from '../../../types/appSession';

const store$ = createStore(
  'store',
  Observable.combineLatest(appSession$, (appSession: AppSession) => () => ({
    appSession
  }))
);

const props = (store: any) => ({
  ...store
});

export default flowRight([inject(store$, props)])(TaxonClassification);
