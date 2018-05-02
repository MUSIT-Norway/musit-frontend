// @flow

import React from 'react';
import Pagination from '../../../search/components/pagination';
import SearchStats from '../../../search/components/SearchStats';
import { I18n } from 'react-i18nify';
import AnalysisInputFormComponent from './AnalysisInputFormComponent';
import type { SearchHit } from 'types/search';
import type { SearchStoreState, ChangePage } from '../../../search/searchStore';
import { getStatusText } from '../shared/getters';
import './analysisSearchComponent.css';
import moment from 'moment';
import pullRight from '../../../shared/pullRight';

const DateFormat = 'DD.MM.YYYY HH:mm';

export type Methods = {
  getAnalysisTypeText: (id: number) => ?string,
  goToAnalysis: (id: number) => void,
  goToObject: (id: string, type: string) => void
};

export type AnlysisSearchComoponentProps = {
  onSearch: () => void,
  onChangeQueryParam: (name: string, value: string) => void,
  onChangePage: (page: ChangePage) => void,
  searchStore: SearchStoreState
} & Methods;

export type ResultHitProps = {
  icon: string,
  header: string,
  metaInfo: Array<string | React$Node>,
  onClickHeader: () => void
};

const AnalysisResultHit = (props: ResultHitProps) => {
  return (
    <div className="media musit__media--search">
      <div className="media-left">
        <span className={`icon icon-musit-${props.icon}`} />
      </div>
      <div className="media-body">
        <h4 className="media-heading link" onClick={props.onClickHeader}>
          {props.header}
          <a href="select">
            <span />
          </a>
        </h4>
        <div className="row">
          {props.metaInfo.map((mi, i) => (
            <div key={i} className="col-md-3">
              {mi}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getParent = (hit: SearchHit): ?{ id: number, status?: ?number } => {
  if (!hit.inner_hits.analysisCollection) {
    return null;
  }
  const hits = hit.inner_hits.analysisCollection.hits;
  if (hits.total === 0) {
    return null;
  }
  return hits.hits[0]._source;
};

const getResultHitProps = (
  props: {
    hit: SearchHit
  } & Methods
): ResultHitProps => {
  if (props.hit._type === 'analysis') {
    const source = props.hit._source;
    const parent = getParent(props.hit);
    const type = props.getAnalysisTypeText(source.analysisTypeId);
    const statusText = getStatusText(parent ? parent.status : source.status);
    const dateText = moment(source.registeredBy.date).format(DateFormat);
    return {
      icon: 'microscope',
      header: `Analysis - ${type || ''}`,
      metaInfo: [
        'Registered by: ' + source.registeredBy.name,
        'Date: ' + dateText,
        'Status: ' + statusText,
        <button
          className="btn-link"
          onClick={() => props.goToObject(source.objectId, source.objectType)}
        >
          Go to object
        </button>
      ],
      onClickHeader: () => props.goToAnalysis(parent ? parent.id : source.id)
    };
  }
  if (props.hit._type === 'analysisCollection') {
    const source = props.hit._source;
    const type = props.getAnalysisTypeText(source.analysisTypeId);
    const dateText = moment(source.registeredBy.date).format(DateFormat);
    const statusText = getStatusText(source.status);
    return {
      icon: 'microscope',
      header: `AnalysisCollection - ${type || ''}`,
      metaInfo: [
        'Registered by: ' + source.registeredBy.name,
        'Date: ' + dateText,
        'Status: ' + statusText
      ],
      onClickHeader: () => props.goToAnalysis(source.id)
    };
  }
  return {
    icon: '',
    header: 'Unknown type: ' + props.hit._type,
    metaInfo: [],
    onClickHeader: () => {}
  };
};

const SearchHits = (
  props: {
    hits: Array<SearchHit>
  } & Methods
) => {
  const goToAnalysis = props.goToAnalysis;
  const goToObject = props.goToObject;
  const getAnalysisTypeText = props.getAnalysisTypeText;
  return (
    <div>
      {props.hits.map(hit => {
        const props = getResultHitProps({
          hit,
          getAnalysisTypeText,
          goToAnalysis,
          goToObject
        });
        return <AnalysisResultHit key={hit._id} {...props} />;
      })}
    </div>
  );
};

const RightAlignedPagination = pullRight(Pagination);

const SearchResultItem = (
  props: {
    onChangePage: (page: ChangePage) => void,
    searchStore: SearchStoreState
  } & Methods
) =>
  props.searchStore.result && props.searchStore.result.hits.total > 0 ? (
    <div>
      <SearchStats searchStore={props.searchStore} />

      {props.searchStore.pagination && (
        <RightAlignedPagination
          paging={props.searchStore.pagination}
          onChangePage={props.onChangePage}
        />
      )}

      {props.searchStore.result && (
        <SearchHits
          hits={props.searchStore.result.hits.hits || []}
          goToAnalysis={props.goToAnalysis}
          getAnalysisTypeText={props.getAnalysisTypeText}
          goToObject={props.goToObject}
        />
      )}

      {props.searchStore.pagination && (
        <RightAlignedPagination
          paging={props.searchStore.pagination}
          onChangePage={props.onChangePage}
        />
      )}
    </div>
  ) : (
    <div>{I18n.t('musit.search.noResults')}</div>
  );

const AnalysisSearchComponent = (props: AnlysisSearchComoponentProps) => (
  <div className="container">
    <h1>{I18n.t('musit.analysis.search')}</h1>

    <AnalysisInputFormComponent
      onChangeQueryParam={props.onChangeQueryParam}
      onSearch={props.onSearch}
      searchStore={props.searchStore}
    />

    {props.searchStore.loading && <div>Searching...</div>}
    {!props.searchStore.loading && props.searchStore.result ? (
      <SearchResultItem
        searchStore={props.searchStore}
        onChangePage={props.onChangePage}
        getAnalysisTypeText={props.getAnalysisTypeText}
        goToAnalysis={props.goToAnalysis}
        goToObject={props.goToObject}
      />
    ) : (
      <div>{I18n.t('musit.search.ready')}</div>
    )}
  </div>
);

export default AnalysisSearchComponent;
