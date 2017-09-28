//@flow
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { ConservationSavePayload } from '../../../models/conservation/conservation';
import type { ObjectData } from '../../../types/object';
import type { Observable } from 'rxjs';

export type Location<T> = {
  state?: T
};

export function getObjects(
  objects: Array<ObjectData>,
  location: Location<Array<ObjectData>>
) {
  if (objects && objects.length > 0) {
    return objects;
  } else {
    return location.state;
  }
}

function submitForm(
  id: ?number,
  appSession: AppSession,
  history: History,
  data: ConservationSavePayload,
  objectData: Array<ObjectData>,
  ajaxPost: (url: string) => Observable<*>,
  ajaxPut: (url: string) => Observable<*>
) {
  return {};
}
