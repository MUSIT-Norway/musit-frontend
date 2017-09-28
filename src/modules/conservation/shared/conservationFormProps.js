// @flow
import type { Location } from '../shared/submit';
import type { ObjectData } from '../../../types/object';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { Store } from '../shared/conservationStoreType';
import type { DomEvent } from '../../../types/dom';
import type { FormData } from './formType';
import { getObjects } from './submit';
import toArray from 'lodash/toArray';

type ConservationFormProps = {|
  updateForm: Function,
  store: Store,
  history: History,
  location: Location<Array<ObjectData>>,
  form: FormData,
  appSession: AppSession
|};

export default function conservationFormProps(
  props: ConservationFormProps,
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) {
  return {
    ...props,
    objects: getObjects(
      toArray(props.form.objects && props.form.objects.value),
      props.location
    ),
    updateStringField: updateStringField(props.updateForm),
    updateArrayField: updateArrayField(props.updateForm),
    updateBooleanField: updateBooleanField(props.updateForm)
  };
}

type OnUnMountProps = {
  clearForm: Function,
  clearStore: Function
};

export const onUnMount = (props: OnUnMountProps) => {
  props.clearForm();
  props.clearStore();
};

function updateStringField(updateForm) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value
    });
}

function updateBooleanField(updateForm) {
  return (name: string, b: boolean) => () =>
    updateForm({
      name,
      rawValue: b
    });
}

function updateArrayField(updateForm) {
  return (name: string) => (evt: DomEvent) =>
    updateForm({
      name,
      rawValue: evt.target.value.split(',').map(v => v.trim())
    });
}
