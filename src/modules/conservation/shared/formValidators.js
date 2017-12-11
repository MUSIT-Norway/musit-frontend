// @flow
import * as revalidate from 'revalidate';
import type { Person } from '../../../types/person';
import type { ConservationSubTypes } from '../../../types/conservation';
import { I18n } from 'react-i18nify';

export const subEventValidator = revalidate.createValidator(
  (message: string) => (value: Array<ConservationSubTypes>) => {
    return value.reduce(function(message, e) {
      if (e.actorsAndRoles && e.actorsAndRoles.length > 0) {
        return e.actorsAndRoles.reduce(function(m, a) {
          if (!a.role) {
            return 'Actor with empty role is not allowed';
          }
          if (!a.uuid) {
            return 'Actor without UUID is not allowed';
          }
          if (m) {
            return m;
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
      if (!person.role) {
        return I18n.t('musit.conservation.errorMessages.noRoleForPerson');
      }
      if (!person.uuid) {
        return I18n.t('musit.conservation.errorMessages.noUUIDForPerson');
      }
      if (m) {
        return m;
      }
      return '';
    }, '');
  },
  (field: string) => `${field} contain error(s)`
);
