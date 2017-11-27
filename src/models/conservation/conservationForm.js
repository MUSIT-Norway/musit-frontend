// @flow
import type { Field } from '../../forms/form';
import type { ConservationCollection } from '../../types/conservation';

export type FormValue = {
  name: string,
  defaultValue: ?any,
  rawValue?: ?any
};

const toField = (name: string, defaultValue: ?any): FormValue => ({
  name,
  defaultValue
});

export const fromJsonToForm: (
  json: ConservationCollection,
  fields: Array<Field<*>>
) => Array<FormValue> = (json, formDef) => {
  const formValues = formDef.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: toField(field.name, json[field.name])
    }),
    {}
  );

  const persons =
    json.actorsAndRoles &&
    json.actorsAndRoles.map(a => ({
      uuid: a.actorId,
      name: a.actorName,
      role: a.roleId,
      date: a.date
    }));

  formValues.actorsAndRoles = toField('actorsAndRoles', persons);

  return Object.keys(formValues).map(key => formValues[key]);
};
