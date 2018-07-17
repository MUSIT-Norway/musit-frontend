// @flow
import * as revalidate from 'revalidate';
import { Person } from '../../../types/person';
import { ConservationSubTypes } from '../../../types/conservation';
import { I18n } from 'react-i18nify';

export const subEventValidator = revalidate.createValidator(
  (message: string) => (value: Array<ConservationSubTypes>) => {
    return value.reduce(function(m: string, e: ConservationSubTypes) {
      if (e.actorsAndRoles && e.actorsAndRoles.length > 0) {
        return e.actorsAndRoles.reduce(function(akk: string, a: Person) {
          if (!a.role) {
            return I18n.t('musit.conservation.errorMessages.noRoleForPerson');
          }
          if (!a.uuid) {
            return I18n.t('musit.conservation.errorMessages.noUUIDForPerson');
          }
          if (akk) {
            return akk;
          }
          return '';
        }, '');
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
