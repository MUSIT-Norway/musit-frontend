import { InputCollectingEvent } from '../../../../models/object/collectingEvent';
import { InputPlace } from '../../../../models/object/place';

export type CollectingEventState = InputCollectingEvent & { place: InputPlace } & {
  editingCollectingEvent?: InputCollectingEvent;
  editingPlace?: InputPlace;
};
