// @flow

import React from 'react';
import { I18n } from 'react-i18nify';

import type { SearchStoreState } from '../searchStore';

export type Props = {
  searchStore: SearchStoreState
};

const SearchStats = (props: Props) =>
  props.searchStore.result && (
    <div>
      {I18n.t('musit.search.stats', {
        limit: props.searchStore.limit,
        total: props.searchStore.result.hits.total,
        timeUsed: props.searchStore.result.took
      })}
    </div>
  );

export default SearchStats;
