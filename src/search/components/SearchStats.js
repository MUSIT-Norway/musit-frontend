// @flow

import React from 'react';
import { I18n } from 'react-i18nify';
import min from 'lodash/min';

import type { SearchStoreState } from '../searchStore';

export type Props = {
  searchStore: SearchStoreState
};

const SearchStats = (props: Props) =>
  props.searchStore.result && (
    <div>
      {I18n.t('musit.search.stats', {
        from: props.searchStore.from + 1,
        to: min([
          props.searchStore.from + props.searchStore.limit,
          props.searchStore.result.hits.total
        ]),
        total: props.searchStore.result ? props.searchStore.result.hits.total : 0,
        timeUsed: props.searchStore.result ? props.searchStore.result.took : 0
      })}
    </div>
  );

export default SearchStats;
