// @flow
import type { Field } from '../../forms/form';
import type { AnalysisCollection } from '../../types/analysis';
import type { CollectionId } from 'types/ids';
import type { ImportAnalysisResult } from 'types/analysisResult';

export type FormValue = {
  name: string,
  defaultValue: ?string | boolean | Array<any>
};

const toField = (
  name: string,
  defaultValue: ?string | boolean | Array<any>
): FormValue => ({
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
  formValues.restrictions = toField('restrictions', !!restriction);
  if (restriction) {
    formValues.restrictions_requester = toField(
      'restrictions_requester',
      restriction.requester
    );
    formValues.restrictions_requesterName = toField(
      'restrictions_requesterName',
      restriction.requesterName
    );
    formValues.restrictions_reason = toField('restrictions_reason', restriction.reason);
    formValues.restrictions_caseNumbers = toField(
      'restrictions_caseNumbers',
      restriction.caseNumbers
    );
    formValues.restrictions_cancelledReason = toField(
      'restrictions_cancelledReason',
      restriction.cancelledReason
    );
    formValues.restrictions_expirationDate = toField(
      'restrictions_expirationDate',
      restriction.expirationDate
    );
  }

  const result = json.result;
  if (result) {
    formValues.comments = toField('comments', result.comment);
    formValues.externalSource = toField('externalSource', result.extRef);
  }

  return Object.keys(formValues).map(key => formValues[key]);
};
