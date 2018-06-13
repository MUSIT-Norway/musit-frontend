// @flow

import * as PropTypes from 'prop-types';
import { Observable } from 'rxjs';

import { AppSession } from '../types/appSession';

export const createAppSessionContext = (appSession: AppSession) => ({
  context: {
    appSession$: Observable.of(appSession)
  },
  childContextTypes: { appSession$: PropTypes.instanceOf(Observable).isRequired }
});

export const createEnLangAppSessionContext = () =>
  createAppSessionContext({
    museumId: 99,
    collectionId: '0000-0000-0000',
    accessToken: 'dummy-token',
    actor: { fn: 'Test Testersen' },
    language: { isEn: false, isNo: true },
    rolesForModules: {
      collectionManagementRead: true,
      collectionManagementWrite: true,
      storageFacilityRead: true,
      storageFacilityWrite: true,
      storageFacilityAdmin: true,
      documentArchiveRead: true,
      documentArchiveWrite: true
    }
  });

export const createNoLangAppSessionContect = () =>
  createAppSessionContext({
    museumId: 99,
    collectionId: '0000-0000-0000',
    accessToken: 'dummy-token',
    actor: { fn: 'Test Testersen' },
    language: { isEn: false, isNo: true },
    rolesForModules: {
      collectionManagementRead: true,
      collectionManagementWrite: true,
      storageFacilityRead: true,
      storageFacilityWrite: true,
      storageFacilityAdmin: true,
      documentArchiveRead: true,
      documentArchiveWrite: true
    }
  });
