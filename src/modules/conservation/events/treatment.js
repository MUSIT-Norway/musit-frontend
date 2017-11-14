import React from 'react';
import { I18n } from 'react-i18nify';
import Select from 'react-select';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { TreatmentType } from '../../../types/conservation';

export type TreatmentProps = {
  materials: Array<any>,
  keywords: Array<any>,
  treatment: TreatmentType,
  appSession?: AppSession,
  viewMode?: boolean,
  onChange: Function
};
export default function Treatment(props: TreatmentProps) {
  const optionsKeywords = props.keywords.map(k => ({
    value: k.id.toString(),
    label: k.noTerm || k.enTerm
  }));

  const optionsMaterials = props.materials.map(m => ({
    value: m.id.toString(),
    label: m.noTerm || m.enTerm
  }));
  return (
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

      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor="note">
          {I18n.t('musit.conservation.events.treatment.note')}
        </label>
        <div className="col-md-10">
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
    </div>
  );
}
