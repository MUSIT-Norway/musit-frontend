import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SampleFormAddComponent from './SampleAddComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import Sample from '../../models/sample';
import mount from '../../shared/mount';
import React from 'react';
import { Observable } from 'rxjs';
import { emitError, emitSuccess } from '../../shared/errors';
import { toPromise } from '../../shared/util';
import objectStore$, { loadObject$ } from '../objects/objectStore';

const { form$, updateForm$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  form$,
  objectStore$
};

const props = {
  addSample: toPromise(Sample.addSample()),
  emitSuccess,
  emitError
};

const commands = { updateForm$, loadForm$, loadObject$ };

const onMount = ({appSession, params, loadObject}: any) => {
  const uuid: string = params.objectId;
  const oldId: string = params.objectId;
  const museumId: number = appSession.museumId;
  const accessToken: string = appSession.accessToken;
  const collectionId: string = appSession.collectionId;
  const ajaxProps = {
    id: uuid,
    objectId: oldId,
    museumId: museumId,
    token: accessToken,
    collectionId: collectionId
  };
  loadObject(ajaxProps);

};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleFormAddComponent
);
