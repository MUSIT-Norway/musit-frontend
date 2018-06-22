// @flow
import { Field } from '../../forms/form';
import { ConservationCollection, ActorsAndRoles } from '../../types/conservation';
import { Maybe, Star, TODO } from '../../types/common';

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
  json: ConservationCollection,
  fields: Array<Field<Star>>
) => Array<FormValue> = (json, formDef) => {
  const formValues = formDef.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: toField(field.name, json[field.name])
    }),
    {}
  ) as TODO;

  const persons =
    json.actorsAndRoles &&
    json.actorsAndRoles.map(a => ({
      uuid: a.actorId,
      name: a.actorName,
      role: a.roleId,
      date: a.date
    }));

  const subEvents = json.events.map(e => ({
    ...e,
    actorsAndRoles: e.actorsAndRoles.map((a: ActorsAndRoles) => ({
      uuid: a.actorId,
      name: a.actorName,
      role: a.roleId,
      date: a.date
    }))
  }));

  formValues.actorsAndRoles = toField('actorsAndRoles', persons);
  formValues.events = toField('events', subEvents);

  return Object.keys(formValues).map(key => formValues[key]);
};
