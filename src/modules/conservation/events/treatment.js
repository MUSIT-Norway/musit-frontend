import React from 'react';
import { I18n } from 'react-i18nify';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { TreatmentProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function Treatment(props: TreatmentProps) {
  const getMultiSelectOptionObject = objects =>
    objects.map(o => ({
      value: o.id.toString(),
      label: props.appSession.language.isEn ? o.enTerm : o.noTerm
    }));
  const optionsKeywords = getMultiSelectOptionObject(props.keywords);
  const optionsMaterials = getMultiSelectOptionObject(props.materials);
  const suffix = ':';

  const extraAttributes = (
    <div>
      <FieldMultiSelect
        name={props.name + 'keywords'}
        stringValue={props.treatment.keywords.join(',')}
        labelAbove={true}
        options={optionsKeywords}
        onChange={v =>
          props.onChange('keywords')(
            v ? v.split(',').map(i => Number.parseFloat(i)) : []
          )}
        title={I18n.t('musit.conservation.events.treatment.keyword') + suffix}
        titleSize="h4"
        viewMode={props.viewMode}
      />
      <FieldMultiSelect
        name={props.name + 'material'}
        stringValue={props.treatment.materials.join(',')}
        labelAbove={true}
        options={optionsMaterials}
        onChange={v =>
          props.onChange('materials')(
            v ? v.split(',').map(i => Number.parseFloat(i)) : []
          )}
        title={I18n.t('musit.conservation.events.treatment.materialUsage') + suffix}
        titleSize="h4"
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.treatment}
      eventName={I18n.t('musit.conservation.events.treatment.treatment')}
      noteLabel={I18n.t('musit.conservation.events.treatment.note')}
      extraAttributes={extraAttributes}
    />
  );
}
