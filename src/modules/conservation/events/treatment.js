import React from 'react';
import { I18n } from 'react-i18nify';
import Select from 'react-select';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { Field } from 'forms/form';
import ObjectSelection from '../components/objectSelection';
import CollapsableEvent from '../components/collapsableEvent';
import type { TreatmentType } from '../../../types/conservation';

type types = { id: number, noLabel: string, enLabel?: string };

export type TreatmentProps = {
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  materials: Array<any>,
  keywords: Array<any>,
  treatment: TreatmentType,
  appSession?: AppSession,
  viewMode?: boolean,
  onChange?: Functionn
};
export default function Treatment(props: TreatmentProps) {
  const getMultiSelectOptionObject = objects =>
    objects.map(o => ({
      value: o.id.toString(),
      label: props.appSession.language.isEn ? o.enTerm : o.noTerm
    }));

  const optionsKeywords = getMultiSelectOptionObject(props.keywords);

  const optionsMaterials = getMultiSelectOptionObject(props.materials);

  const treatmentComponents = (
    <div className="container">
      <FieldMultiSelect
        name={'keywords'}
        stringValue={props.treatment.keywords.join(',')}
        options={optionsKeywords}
        onChange={v =>
          props.onChange('keywords')(v.split(',').map(i => Number.parseFloat(i)))}
        title={I18n.t('musit.conservation.events.treatment.keyword')}
        viewMode={props.viewMode}
      />
      <FieldMultiSelect
        name={'material'}
        stringValue={props.treatment.materials.join(',')}
        options={optionsMaterials}
        onChange={v =>
          props.onChange('materials')(v.split(',').map(i => Number.parseFloat(i)))}
        title={I18n.t('musit.conservation.events.treatment.materialUsage')}
        viewMode={props.viewMode}
      />

      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="note">
          {I18n.t('musit.conservation.events.treatment.note')}
        </label>
        <div className="col-md-9">
          <textarea
            className="form-control"
            id="note"
            value={props.treatment.note}
            onChange={t => props.onChange('note')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>

      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.treatment.affectedThings}
        affectedThingsSubEventOnChange={t =>
          props.onChange('affectedThings')(t.target.value)}
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <CollapsableEvent
      eventName={I18n.t('musit.conservation.events.treatment.treatment')}
      eventComponent={treatmentComponents}
    />
  );
}
