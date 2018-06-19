import React from 'react';

import { RxInjectLegacy as inject } from '../shared/react-rxjs-patch/';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';

import type { AppSession } from 'types/appSession';

export type Props = { en: string, no: string, appSession: AppSession };

export const MusitI18n = (props: Props) => {
  if (props.appSession.language.isEn) {
    return <span>{props.en}</span>;
  } else if (props.appSession.language.isNo) {
    return <span>{props.no}</span>;
  } else {
    throw new Error('No language selected');
  }
};

export const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired }
};

export default inject(data)(MusitI18n);
