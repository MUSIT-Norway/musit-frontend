// @flow
import {
  getAnalysisTypeTerm,
  getObjects,
  getObjectsWithType,
  submitForm
} from '../shared/submit';
import Analysis from '../../../models/analysis';
import { simplePost, simplePut } from '../../../shared/RxAjax';
import { toPromise } from '../../../shared/util';
import type { Predefined } from '../shared/predefinedType';
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { Store } from '../shared/storeType';

type DomEvent = { preventDefault: Function, target: { value: string } };

export default (
  props: {
    updateForm: Function,
    store: Store,
    appSession: AppSession,
    form: FormData,
    history: History
  },
  ajaxPost: Function = simplePost,
  ajaxPut: Function = simplePut
) => {
  const objects = getObjects(props);
  return {
    ...props,
    updateStringField: (name: string) => (evt: DomEvent) =>
      props.updateForm({
        name,
        rawValue: evt.target.value
      }),
    updateBooleanField: (name: string, b: boolean) => () =>
      props.updateForm({
        name,
        rawValue: b
      }),
    updateArrayField: (name: string) => (evt: DomEvent) =>
      props.updateForm({
        name,
        rawValue: evt.target.value.split(',').map(v => v.trim())
      }),
    getAnalysisTypeTerm: (predefined: Predefined) =>
      getAnalysisTypeTerm(props.store, predefined, props.appSession),
    objects,
    clickSave: (evt: DomEvent) => {
      evt.preventDefault();
      const saveAnalysisFn = props.form.id.value
        ? Analysis.editAnalysisEvent(ajaxPut)
        : Analysis.saveAnalysisEvent(ajaxPost);
      const saveResultFn = Analysis.addResult(ajaxPost);
      const objectsWithType = getObjectsWithType(objects);
      submitForm(
        props.appSession,
        props.form,
        objectsWithType,
        toPromise(saveAnalysisFn),
        toPromise(saveResultFn),
        props.history.push
      );
    },
    clickCancel: (evt: DomEvent) => {
      evt.preventDefault();
      props.history.goBack();
    }
  };
};
