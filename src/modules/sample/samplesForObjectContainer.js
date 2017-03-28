import inject from 'react-rxjs/dist/RxInject';
import SamplesForObjectComponent from './SamplesForObjectComponent';
import React from 'react';
import {Observable} from 'rxjs';
import  mount from '../../shared/mount';
import {emitError, emitSuccess} from '../../shared/errors';
import flowRight from 'lodash/flowRight';
import sampleStore$, {loadSamplesForObject$} from './sampleStore';

const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
  sampleStore$
};

const props = {
  emitSuccess,
  emitError
};

const commands = {loadSamplesForObject$};

const onMount = ({ loadSamplesForObject, params, appSession }) => {
  const objectId = params.parentId;
  const museumId = appSession.state.museumId;
  const accessToken = appSession.state.accessToken;
  const val = {objectId: objectId, museumId: museumId, token: accessToken};
  loadSamplesForObject(val);
};

export default flowRight([
  inject(data, commands, props),mount(onMount)]
 )(SamplesForObjectComponent);