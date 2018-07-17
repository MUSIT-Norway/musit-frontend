import * as React from 'react';
import { I18n } from 'react-i18nify';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import { TreatmentProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';
import { TODO, Maybe } from '../../../types/common';

export default function Treatment(props: TreatmentProps) {
  const getMultiSelectOptionObject = (objects: TODO[]) =>
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
        name={(props as TODO).name + 'keywords'}
        stringValue={props.treatment.keywords && props.treatment.keywords.join(',')}
        labelAbove={true}
        options={optionsKeywords}
        onChange={(
          v: Maybe<string> //TODO: Add proper typing on the onChange event! Based on the body, Maybe<string> makes sense, but doesn't seem to make much sense from the perspective of the onChange event itself!
        ) =>
          props.onChange('keywords')(v ? v.split(',').map(i => Number.parseFloat(i)) : [])
        }
        title={I18n.t('musit.conservation.events.treatment.keyword') + suffix}
        titleSize="h4"
        viewMode={props.viewMode}
      />
      <FieldMultiSelect
        name={(props as TODO).name + 'material'}
        stringValue={props.treatment.materials && props.treatment.materials.join(',')}
        labelAbove={true}
        options={optionsMaterials}
        onChange={(
          v: Maybe<String> //TODO: Add proper typing on the onChange event! Based on the body, Maybe<string> makes sense, but doesn't seem to make much sense from the perspective of the onChange event itself!
        ) =>
          props.onChange('materials')(
            v ? v.split(',').map(i => Number.parseFloat(i)) : []
          )
        }
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
