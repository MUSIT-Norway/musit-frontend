import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import objectSearchStore$, {
  clearSearch$,
  searchForObjects$,
  onChangeField$
} from './objectSearchStore';
import { toggleObject$ } from '../../stores/pickList';
import { isItemAdded } from '../../stores/pickList';
import flowRight from 'lodash/flowRight';
import { makeUrlAware } from '../../stores/appSession';
import { hashHistory } from 'react-router';
import ObjectSearchComponent from './ObjectSearchComponent';
import MusitObject from '../../models/object';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  pickList$: { type: PropTypes.object.isRequired },
  objectSearchStore$
};

const commands = {
  clearSearch$,
  searchForObjects$,
  onChangeField$
};

const props = {
  pickObject: MusitObject.pickObject(toggleObject$),
  isItemAdded,
  goTo: hashHistory.push
};

export default flowRight([inject(data, commands, props), makeUrlAware])(
  ObjectSearchComponent
);
