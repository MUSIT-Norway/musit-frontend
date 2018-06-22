// @flow
import { Field } from '../../forms/form';
import { AnalysisCollection } from '../../types/analysis';
import { Maybe, Star, MUSTFIX, BUG } from '../../types/common';
import { Person } from '../../types/person';

export type FormValue = {
  name: string;
  defaultValue: Maybe<any>;
  rawValue?: Maybe<any>;
};

const toField = (name: string, defaultValue: Maybe<any>): FormValue => ({
  name,
  defaultValue
});

export const fromJsonToForm: (
  json: AnalysisCollection,
  fields: Array<Field<Star>>
) => Array<FormValue> = (json, formDef) => {
  const formValues: MUSTFIX = formDef.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: toField(field.name, json[field.name])
    }),
    {}
  );

  let persons = [] as Person[];
  if (formValues.doneBy && formValues.doneBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.doneByName as MUSTFIX,
        uuid: json.doneBy as MUSTFIX,
        role: 'doneBy',
        date: json.doneDate as MUSTFIX
      }
    ]);
  }

  if (formValues.responsible && formValues.responsible.defaultValue) {
    persons = persons.concat([
      {
        name: json.responsibleName as MUSTFIX,
        uuid: json.responsible as MUSTFIX,
        role: 'responsible',
        date: null as BUG
      }
    ]);
  }

  if (formValues.administrator && formValues.administrator.defaultValue) {
    persons = persons.concat([
      {
        name: json.administratorName as MUSTFIX,
        uuid: json.administrator as MUSTFIX,
        role: 'administrator',
        date: null as BUG
      }
    ]);
  }

  if (formValues.completedBy && formValues.completedBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.completedByName as MUSTFIX,
        uuid: json.completedBy as MUSTFIX,
        role: 'completedBy',
        date: json.completedDate as MUSTFIX
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
