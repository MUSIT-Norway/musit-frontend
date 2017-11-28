import React from 'react';
import { I18n } from 'react-i18nify';
import Select from 'react-select';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { Field } from 'forms/form';
import ObjectSelection from '../components/objectSelection';
import type { TreatmentType } from '../../../types/conservation';
import FontAwesome from 'react-fontawesome';
import CollapsibleEvent from '../components/CollapsibleEvent';
import PersonRoleDate from '../../../components/person/PersonRoleDate';
import ViewPersonRoleDate from '../../../components/person/ViewPersonRoleDate';
import find from 'lodash/find';

type types = { id: number, noLabel: string, enLabel?: string };

export type TreatmentProps = {
  name: string,
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  materials: Array<any>,
  keywords: Array<any>,
  treatment: TreatmentType,
  index?: number,
  appSession?: AppSession,
  onChangePersonActorRole: Function,
  viewMode?: boolean,
  onChange?: Function,
  onDelete?: Function,
  expanded?: boolean,
  toggleExpanded: Function
};
export default function Treatment(props: TreatmentProps) {
  const getMultiSelectOptionObject = objects =>
    objects.map(o => ({
      value: o.id.toString(),
      label: props.appSession.language.isEn ? o.enTerm : o.noTerm
    }));
  const optionsKeywords = getMultiSelectOptionObject(props.keywords);
  const optionsMaterials = getMultiSelectOptionObject(props.materials);
  const suffix = ':';

  const treatmentComponents = (
    <div className="container">
      {!props.viewMode &&
      !props.treatment.id && (
        <div className="row form-group">
          <div div className="col-md-10">
            <button
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                props.onDelete();
              }}
            >
              <FontAwesome name={'times'} />
            </button>
            <hr />
          </div>
        </div>
      )}{' '}
      {props.viewMode ? (
        <ViewPersonRoleDate
          personData={props.treatment.actorsAndRoles || []}
          getDisplayNameForRole={(r: string) => {
            const role = find(props.roleList, rl => rl.roleId === r);
            return role && role.noRole;
          }}
        />
      ) : (
        <PersonRoleDate
          appSession={props.appSession}
          personData={props.treatment.actorsAndRoles}
          fieldName={'actorsAndRoles'}
          updateForm={props.onChangePersonActorRole}
          getDisplayNameForRole={(r: string | number) => {
            const role = find(props.roleList, rl => rl.roleId === r);
            return role.noRole;
          }}
          roles={props.roleList ? props.roleList.map(e => e.roleId) : []}
          showDateForRole={(roleName: string) => [1].some(e => e === roleName)}
        />
      )}{' '}
      <FieldMultiSelect
        name={props.name + 'keywords'}
        stringValue={props.treatment.keywords.join(',')}
        options={optionsKeywords}
        onChange={v =>
          props.onChange('keywords')(
            v ? v.split(',').map(i => Number.parseFloat(i)) : []
          )}
        title={I18n.t('musit.conservation.events.treatment.keyword') + suffix}
        viewMode={props.viewMode}
      />
      <FieldMultiSelect
        name={props.name + 'material'}
        stringValue={props.treatment.materials.join(',')}
        options={optionsMaterials}
        onChange={v =>
          props.onChange('materials')(
            v ? v.split(',').map(i => Number.parseFloat(i)) : []
          )}
        title={I18n.t('musit.conservation.events.treatment.materialUsage') + suffix}
        viewMode={props.viewMode}
      />
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.treatment.note') + suffix}
        </label>
        <div className="col-md-9">
          <textarea
            className="form-control"
            id={`note_${props.index}`}
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
          props.onChange('affectedThings')(t.map(s => s) || [])}
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <CollapsibleEvent
      eventName={I18n.t('musit.conservation.events.treatment.treatment')}
      eventComponent={treatmentComponents}
      expanded={props.expanded}
      toggleExpanded={props.toggleExpanded}
    />
  );
}
