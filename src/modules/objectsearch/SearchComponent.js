// @flow

import React from 'react';
import { I18n } from 'react-i18nify';
import FontAwesome from 'react-fontawesome';
import SearchInputFormComponent from './SearchInputFormComponent';
import './searchComponent.css';
import Pagination from '../../search/components/pagination';
import SearchStats from '../../search/components/SearchStats';
import pullRight from '../../shared/pullRight';

import type { SearchStoreState, ChangePage } from '../../search/searchStore';
import type { SearchHit } from '../../types/search';
import type { ObjectData } from '../../types/object';
import type { SampleData } from '../../types/samples';

export type Events = {
  onClickHeader: (hit: SearchHit) => void,
  onClickShoppingCart: (hit: SearchHit) => void,
  isObjectAdded: (hit: SearchHit) => boolean
};

export type Getters = {
  getObject: (hit: SearchHit) => ?ObjectData,
  getSampleTypeStr: (sample: SampleData) => string
};

export type EventsAndGetters = Events & Getters;

export type SearchComponentProps = {
  searchStore: SearchStoreState,
  onChangeQueryParam: (string, string) => void,
  onChangePage: (change: ChangePage) => void,
  onSearch: () => void
} & EventsAndGetters;

export type ResultHitProps = {
  hit: SearchHit
} & EventsAndGetters;

export type RenderResultHitsProps = {
  hits: Array<SearchHit>
} & EventsAndGetters;

const CollectionResultHit = (props: ResultHitProps) => {
  // we know the type due to the index and type from elasticsearch
  const object: ?ObjectData = props.hit._source;
  return object ? (
    <div className="media musit__media--search">
      <div className="media-left">
        <FontAwesome name="tag" style={{ fontSize: '1.3em', height: 25 }} />
      </div>
      <div className="media-body">
        <h4 className="media-heading link" onClick={() => props.onClickHeader(props.hit)}>
          {object.term}
          <a href="select">
            <span />
          </a>
        </h4>
        <div className="row">
          <div className="col-md-3">MuseumNo: {object.museumNo}</div>
          <div className="col-md-3">SubNo: {object.subNo}</div>
          <div
            className="col-md-2 pull-right"
            onClick={() => props.onClickShoppingCart(props.hit)}
          >
            {props.isObjectAdded(props.hit) ? (
              <FontAwesome
                style={{ fontSize: '1.5em', color: 'Gray' }}
                name="shopping-cart"
                className="pull-right link"
              />
            ) : (
              <FontAwesome
                style={{ fontSize: '1.5em', color: '#337ab7' }}
                name="shopping-cart"
                className="pull-right link"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const SampleResultHit = (props: ResultHitProps) => {
  // we know the type due to the index and type from elasticsearch
  const sample: ?SampleData = props.hit._source;
  const object: ?ObjectData = props.getObject(props.hit);
  return sample ? (
    <div className="media musit__media--search">
      <div className="media-left">
        <span className="icon icon-musit-testtube" />
      </div>
      <div className="media-body">
        <h4 className="media-heading link" onClick={() => props.onClickHeader(props.hit)}>
          {sample.sampleNum} {props.getSampleTypeStr(sample)}
          <a href="select">
            <span />
          </a>
        </h4>
        <div className="row">
          <div className="col-md-3">MuseumNo: {object ? object.museumNo : ''}</div>
          <div className="col-md-3">SubNo: {object ? object.subNo : ''}</div>
          <div className="col-md-3">Gjenstand/Takson: {object ? object.term : ''}</div>
          <div
            className="col-md-2 pull-right"
            onClick={() => props.onClickShoppingCart(props.hit)}
          >
            {props.isObjectAdded(props.hit) ? (
              <FontAwesome
                style={{ fontSize: '1.5em', color: 'Gray' }}
                name="shopping-cart"
                className="pull-right link"
              />
            ) : (
              <FontAwesome
                style={{ fontSize: '1.5em', color: '#337ab7' }}
                name="shopping-cart"
                className="pull-right link"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const UnknownResultHit = (props: ResultHitProps) => (
  <div key={props.hit._id} className="row">
    Unknown type {props.hit._type}
  </div>
);

const getResultHitComponent = (hit: SearchHit): React$ComponentType<ResultHitProps> => {
  let component;
  if (hit._type === 'collection') {
    component = CollectionResultHit;
  } else if (hit._type === 'sample') {
    component = SampleResultHit;
  } else {
    component = UnknownResultHit;
  }
  return component;
};

const RenderResultHits = (props: RenderResultHitsProps) => {
  return (
    <div>
      {props.hits.map(hit => {
        const Component = getResultHitComponent(hit);
        return (
          <Component
            key={hit._id}
            hit={hit}
            onClickHeader={props.onClickHeader}
            onClickShoppingCart={props.onClickShoppingCart}
            getObject={props.getObject}
            getSampleTypeStr={props.getSampleTypeStr}
            isObjectAdded={props.isObjectAdded}
          />
        );
      })}
    </div>
  );
};

const RightAlignedPagination = pullRight(Pagination);

const SearchResultItem = (props: {
  onChangePage: (change: ChangePage) => void,
  searchStore: SearchStoreState,
  onClickHeader: (hit: SearchHit) => void,
  onClickShoppingCart: (hit: SearchHit) => void,
  getObject: (hit: SearchHit) => ?ObjectData,
  getSampleTypeStr: (sample: SampleData) => string,
  isObjectAdded: (hit: SearchHit) => boolean
}) => {
  const result = props.searchStore.result;
  if (result && result.hits.total > 0) {
    const pagination = props.searchStore.pagination;
    return (
      <div>
        <SearchStats searchStore={props.searchStore} />

        {pagination && (
          <RightAlignedPagination paging={pagination} onChangePage={props.onChangePage} />
        )}

        <RenderResultHits
          hits={result.hits.hits}
          onClickHeader={props.onClickHeader}
          onClickShoppingCart={props.onClickShoppingCart}
          getObject={props.getObject}
          getSampleTypeStr={props.getSampleTypeStr}
          isObjectAdded={props.isObjectAdded}
        />

        {pagination && (
          <RightAlignedPagination paging={pagination} onChangePage={props.onChangePage} />
        )}
      </div>
    );
  } else {
    return <div>{I18n.t('musit.search.noResults')}</div>;
  }
};

const SearchComponent = (props: SearchComponentProps) => (
  <div className="container">
    <h1>{I18n.t('musit.objectsearch.title')}</h1>

    <SearchInputFormComponent
      onChange={props.onChangeQueryParam}
      search={props.onSearch}
    />

    {props.searchStore && props.searchStore.loading && <div>Searching...</div>}
    {props.searchStore && !props.searchStore.loading && props.searchStore.result ? (
      <SearchResultItem
        searchStore={props.searchStore}
        onChangePage={props.onChangePage}
        onClickHeader={props.onClickHeader}
        onClickShoppingCart={props.onClickShoppingCart}
        getObject={props.getObject}
        getSampleTypeStr={props.getSampleTypeStr}
        isObjectAdded={props.isObjectAdded}
      />
    ) : (
      <div>{I18n.t('musit.search.ready')}</div>
    )}
  </div>
);

export default SearchComponent;
