import React from 'react';
import { I18n } from 'react-i18nify';
import Select from 'react-select';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { Field } from 'forms/form';

type types = { id: number, noLabel: string, enLabel?: string };

export type TreatmentProps = {
  keywords?: Array<Field<string>>,
  keywordTypes?: Array<types>,
  keywordTypesOnChange?: Function,
  materialUsage?: Array<Field<string>>,
  materialUsageTypes?: Array<types>,
  materialUsageOnChange?: Function,
  note?: Field,
  noteOnChange?: Function,
  appSession?: AppSession,
  viewMode?: boolean
};
export default function Treatment(props: TreatmentProps) {
  let options = [
    { id: 'one', noLabel: 'fsdfsd' },
    { id: '2', noLabel: 'Limit' },
    { id: '3', noLabel: 'PEG-impregnert' },
    { id: '4', noLabel: '4' },
    { id: '4', noLabel: '4' },
    { id: 'two', noLabel: 'Two' }
  ];
  let selectedValue = [{ value: '2', name: 'test' }, { value: '3', name: 'test' }];

  let options2 = [
    { value: 'one', label: 'One' },
    { value: '2', label: 'Two' },
    { value: '3', label: 'Three' },
    { value: '4', label: '4' },
    { value: '4', label: '4' },
    { value: 'two', label: 'Two label' }
  ];

  function logChange(val) {
    console.log('Selected: ', val);
  }
  return (
    <div className="container">
      <FieldMultiSelect
        fields={selectedValue}
        options={options}
        onChange={el => logChange(el)}
        title={I18n.t('musit.conservation.events.treatment.keyword')}
        viewMode={props.viewMode}
      />
      <FieldMultiSelect
        fields={selectedValue}
        options={options}
        onChange={el => logChange(el)}
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
            value="test note"
            onChange={e => e}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
    </div>
  );
}
