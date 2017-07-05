import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import objectSearchStore$, {
  clearSearch$,
  searchForObjects$,
  onChangeField$,
  clearStore$
} from './objectSearchStore';
import { toggleObject$ } from '../../stores/pickList';
import { isItemAdded } from '../../stores/pickList';
import ObjectSearchComponent from './ObjectSearchComponent';
import MusitObject from '../../models/object';
import lifeCycle from '../../shared/lifeCycle';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  pickList$: { type: PropTypes.object.isRequired },
  objectSearchStore$
};

const commands = {
  clearSearch$,
  searchForObjects$,
  onChangeField$,
  clearStore$
};

const props = props => ({
  ...props,
  pickObject: MusitObject.pickObject(toggleObject$),
  isItemAdded,
  goTo: props.history.push
});

export default inject(data, commands, props)(
  lifeCycle({ onMount: props => props.clearStore() })(ObjectSearchComponent)
);
