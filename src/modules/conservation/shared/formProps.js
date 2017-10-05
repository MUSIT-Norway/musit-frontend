// @flow
import { getObjects, getConservationCollection } from '../shared/submit';
import { saveConservation$ } from '../conservationStore';
import type { Location } from '../shared/submit';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { Predefined } from '../../../types/predefined';
import type { ConservationStoreState as Store } from '../../../types/conservation';
import type { DomEvent } from '../../../types/dom';
import toArray from 'lodash/toArray';
import type { ObjectData } from '../../../types/object';
import { isFormValid } from '../../../forms/validators';
import { emitError } from '../../../shared/errors';
import Config from '../../../config';

type FormProps = {|
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  form: FormData,
  history: History,
  predefined?: Predefined,
  location: Location<Array<ObjectData>>
|};

export default function formProps(
  props: FormProps,
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) {
  return {
    ...props,
    isFormValid: isFormValid(props.form),
    objects: getObjects(toArray(props.form.affectedThings.value), props.location),
    updateStringField: updateStringField(props.updateForm),
    updateBooleanField: updateBooleanField(props.updateForm),
    updateArrayField: updateArrayField(props.updateForm),
    clickSave: clickSave(
      props.form,
      props.appSession,
      props.history,
      props.location,
      ajaxPost,
      ajaxPut
    ),
    clickCancel: clickCancel(props)
  };
}

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

function parseOption(type) {
  return option => {
    switch (type) {
      case 'Array[Int]':
      case 'Int':
        return parseInt(option.value, 10);
      default:
        return option.value;
    }
  };
}

function clickSave(form, appSession, history, location, ajaxPost, ajaxPut) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    saveConservation$.next({
      id: form.id.value,
      appSession,
      data: getConservationCollection(form, location),
      ajaxPost,
      ajaxPut,
      callback: {
        onComplete: props => {
          if (!props) {
            return;
          }
          const maybeErrorMessage = props.results
            .filter(res => res.error)
            .concat(props.badFiles)
            .map(res => res.error.xhr.response.message)
            .join('\n')
            .trim();
          if (maybeErrorMessage.length > 0) {
            emitError({
              type: 'errorOnSave',
              message: maybeErrorMessage.replace('in None', '')
            });
          }
          const id = props.id;
          history.replace(
            Config.magasin.urls.client.conservation.viewConservation(
              appSession,
              parseInt(id, 10)
            )
          );
        }
      }
    });
  };
}

function clickCancel(props) {
  return (evt: DomEvent) => {
    evt.preventDefault();
    props.history.goBack();
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
