// @flow

import React from 'react';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import type { SearchStoreState } from '../../../search/searchStore';

export type Props = {
  onChangeQueryParam: (key: string, value: string) => void,
  onSearch: () => void,
  searchStore: SearchStoreState
};

const AnalysisInputFormComponent = (props: Props) => (
  <form>
    <div className="container">
      <div className="row" style={{ paddingBottom: '20px', paddingTop: '20px' }}>
        <input
          className="col-md-7 col-md-offset-2 col-xs-11"
          onChange={e => props.onChangeQueryParam('q', e.target.value)}
          value={
            (props &&
              props.searchStore &&
              props.searchStore.queryParam &&
              props.searchStore.queryParam.q) ||
            ''
          }
          placeholder={I18n.t('musit.analysis.queryPlaceholder')}
          type="text"
        />
        <div className="col-md-1 col-xs-1">
          <button
            className="btn btn-default"
            type="submit"
            onClick={e => {
              e.preventDefault();
              return props.onSearch();
            }}
          >
            <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
          </button>
        </div>
      </div>
    </div>
  </form>
);

export default AnalysisInputFormComponent;
