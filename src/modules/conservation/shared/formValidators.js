// @flow
import * as revalidate from 'revalidate';
import type { Person } from '../../../types/person';
import type { ConservationSubTypes } from '../../../types/conservation';

export const subEventValidator = revalidate.createValidator(
  (message: string) => (value: Array<ConservationSubTypes>) => {
    return value.reduce(function(message, e) {
      if (e.actorsAndRoles && e.actorsAndRoles.length > 0) {
        return e.actorsAndRoles.reduce(function(m, a) {
          if (m) {
            return m;
          }
          if (!a.role) {
            return 'Actor with empty role is not allowed';
          }
          if (!a.uuid) {
            return 'Actor without UUID is not allowed';
          }
          return '';
        }, message);
      }
      return '';
    }, '');
  },
  (field: string) => `${field} contain error(s) `
);

export const actorsAndRolesValidator = revalidate.createValidator(
  (message: string) => (value: Array<Person>) => {
    return value.reduce(function(m, person) {
      if (m) {
        return m;
      }
      if (!person.role) {
        return 'Actor with empty role is not allowed';
      }
      if (!person.uuid) {
        return 'Actor without UUID is not allowed';
      }
      return '';
    }, '');
  },
  (field: string) => `${field} contain error(s)`
);
