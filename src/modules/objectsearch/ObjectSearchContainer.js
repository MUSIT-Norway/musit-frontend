import React from 'react';
import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import objectSearchStore$, {
  clearSearch$,
  searchForObjects$,
  onChangeField$
} from './objectSearchStore';
import { addObject$ } from '../app/pickList';
import { isItemAdded } from '../app/pickList';
import flowRight from 'lodash/flowRight';
import { makeUrlAware } from '../app/appSession';
import { hashHistory } from 'react-router';
import ObjectSearchComponent from './ObjectSearchComponent';
import MusitObject from '../../models/object';

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  pickList$: { type: React.PropTypes.object.isRequired },
  objectSearchStore$
};

const commands = {
  clearSearch$,
  searchForObjects$,
  onChangeField$
};

const props = {
  pickObject: MusitObject.pickObject(addObject$),
  isItemAdded,
  goTo: hashHistory.push
};

export default flowRight([inject(data, commands, props), makeUrlAware])(
  ObjectSearchComponent
);
