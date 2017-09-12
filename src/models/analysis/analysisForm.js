// @flow
import type { Field } from '../../forms/form';
import type { AnalysisCollection } from '../../types/analysis';

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
  json: AnalysisCollection,
  fields: Array<Field<*>>
) => Array<FormValue> = (json, formDef) => {
  const formValues = formDef.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: toField(field.name, json[field.name])
    }),
    {}
  );

  let persons = [];
  if (formValues.doneBy && formValues.doneBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.doneByName,
        uuid: json.doneBy,
        role: 'doneBy',
        date: json.doneDate
      }
    ]);
  }

  if (formValues.responsible && formValues.responsible.defaultValue) {
    persons = persons.concat([
      {
        name: json.responsibleName,
        uuid: json.responsible,
        role: 'responsible',
        date: null
      }
    ]);
  }

  if (formValues.administrator && formValues.administrator.defaultValue) {
    persons = persons.concat([
      {
        name: json.administratorName,
        uuid: json.administrator,
        role: 'administrator',
        date: null
      }
    ]);
  }

  if (formValues.completedBy && formValues.completedBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.completedByName,
        uuid: json.completedBy,
        role: 'completedBy',
        date: json.completedDate
      }
    ]);
  }
  formValues.persons = toField('persons', persons);

  const restriction = json.restriction;
  const hasRestriction = !!restriction && !restriction.cancelledStamp;
  formValues.restrictions = toField('restrictions', hasRestriction);
  formValues.restriction = toField('restriction', hasRestriction ? restriction : null);
  const result = json.result;
  if (result) {
    formValues.comments = toField('comments', result.comment);
    formValues.externalSource = toField('externalSource', result.extRef);
  }

  return Object.keys(formValues).map(key => formValues[key]);
};
