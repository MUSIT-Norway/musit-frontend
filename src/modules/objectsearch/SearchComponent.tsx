// @flow

import * as React from 'react';
import { I18n } from 'react-i18nify';
import * as FontAwesome from 'react-fontawesome';
import SearchInputFormComponent from './SearchInputFormComponent';
import './searchComponent.css';
import Pagination from '../../search/components/pagination';
import SearchStats from '../../search/components/SearchStats';
import pullRight from '../../shared/pullRight';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { ObjectData } from '../../types/object';

import { SearchStoreState, ChangePage } from '../../search/searchStore';
import { SearchHit } from '../../types/search';
import { SampleData } from '../../types/samples';

import { Node } from '../../types/node';
import * as Loader from 'react-loader';
import { emitWarning } from '../../shared/errors';
import { archaeologyCollectionUuid } from '../../shared/util';
import NavigateSearch from '../../search/NavigateSearch';
import { AppSession } from '../../types/appSession';
import { Maybe } from '../../types/common';

export type Events = {
  onClickHeader: (hit: SearchHit) => void;
  onClickShoppingCart: (hit: SearchHit) => void;
  isObjectAdded: (hit: SearchHit) => boolean;
  onClickBreadcrumb: (node: Node, isObject: boolean) => void;
};

/*
function CollectionResultHit(props: ResultHitProps) {
  // we know the type due to the index and type from elasticsearch
  let hallo=(("test" : any) : ObjectData);
}

*/
export type Getters = {
  getObject: (hit: SearchHit) => ObjectData | undefined;
  getSampleTypeStr: (sample: SampleData) => string;
};

export type EventsAndGetters = Events & Getters;

export type SearchComponentProps = {
  searchStore: SearchStoreState;
  onChangeQueryParam: (p1: string, p2: string) => void;
  onChangePage: (change: ChangePage) => void;
  onSearch: (databaseSearch: boolean) => void;
  onClearSearch: () => void;
  history: () => void;
  appSession: AppSession;
  onClickAddAllToShoppingCart: (hit: Array<SearchHit>) => void;
} & EventsAndGetters;

export type ResultHitProps = {
  hit: SearchHit;
} & EventsAndGetters;

export type RenderResultHitsProps = {
  hits: Array<SearchHit>;
} & EventsAndGetters;

const CollectionResultHit = (props: ResultHitProps) => {
  // we know the type due to the index and type from elasticsearch
  const collObject = props.hit._source as Maybe<ObjectData>;
  if (!collObject) return null;
  return (
    <div className="media musit__media--search">
      <div className="media-left">
        <FontAwesome name="tag" style={{ fontSize: '1.3em', height: 25 }} />
      </div>
      <div className="media-body">
        <h4 className="media-heading link" onClick={() => props.onClickHeader(props.hit)}>
          {collObject.term}
          <a href="select">
            <span />
          </a>
        </h4>
        <div className="row">
          <div className="col-md-3">
            {I18n.t('musit.objects.objectsView.musNo')}: {collObject.museumNo}
          </div>
          <div className="col-md-2">
            {I18n.t('musit.objects.objectsView.subNo')}: {collObject.subNo}
          </div>
          <div className="col-md-3">
            {I18n.t('musit.objects.objectsView.term')}: {collObject.term}
          </div>
          <div className="col-md-3">
            {collObject.collection &&
            collObject.collection.uuid === archaeologyCollectionUuid
              ? I18n.t('musit.objects.objectsView.findingNo') +
                ':' +
                (collObject.arkFindingNo ? collObject.arkFindingNo : '')
              : ''}
          </div>
          <div className="col-md-3">
            {(collObject as ObjectData).currentLocation &&
            (collObject as any).currentLocation.breadcrumb &&
            (collObject as any).currentLocation.breadcrumb.length > 0 ? (
              <span className="labelText">
                <Breadcrumb
                  node={collObject.currentLocation}
                  onClickCrumb={(x: Node) => props.onClickBreadcrumb(x, true)}
                  allActive
                />
              </span>
            ) : (
              ''
            )}
          </div>
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
  );
};

const SampleResultHit = (props: ResultHitProps) => {
  // we know the type due to the index and type from elasticsearch
  const sample: Maybe<SampleData> = props.hit._source;
  const object: Maybe<ObjectData> = props.getObject(props.hit);
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
          <div className="col-md-3">
            {' '}
            {I18n.t('musit.objects.objectsView.musNo')}: {object ? object.museumNo : ''}
          </div>
          <div className="col-md-2">
            {' '}
            {I18n.t('musit.objects.objectsView.subNo')}: {object ? object.subNo : ''}
          </div>
          <div className="col-md-3">
            {I18n.t('musit.objects.objectsView.term')}: {object ? object.term : ''}
          </div>
          <div className="col-md-3">
            {object &&
            object.collection &&
            object.collection.uuid === archaeologyCollectionUuid
              ? I18n.t('musit.objects.objectsView.findingNo') +
                ':' +
                (object.arkFindingNo ? object.arkFindingNo : '')
              : ''}
          </div>
          <div className="col-md-3">
            {sample.currentLocation &&
            sample.currentLocation.breadcrumb &&
            sample.currentLocation.breadcrumb.length > 0 ? (
              <span className="labelText">
                <Breadcrumb
                  node={sample.currentLocation}
                  onClickCrumb={(x: Node) => props.onClickBreadcrumb(x, false)}
                  allActive
                />
              </span>
            ) : (
              ''
            )}
          </div>
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

const getResultHitComponent = (hit: SearchHit): React.ComponentType<ResultHitProps> => {
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
            onClickBreadcrumb={props.onClickBreadcrumb}
          />
        );
      })}
    </div>
  );
};

const RightAlignedPagination = pullRight(Pagination);

const toggleAll = (
  hits: Array<SearchHit>,
  onClickShoppingCart: (hit: SearchHit) => void,
  isObjectAdded: (hit: SearchHit) => boolean,
  onClickAddAllToShoppingCart: (hit: Array<SearchHit>) => void
) => (
  <div className="col" style={{ textAlign: 'right', paddingRight: '12px' }}>
    <FontAwesome
      onClick={e => {
        e.preventDefault();
        hits && onClickAddAllToShoppingCart(hits);
      }}
      style={
        hits && hits.every(isObjectAdded)
          ? { fontSize: '1.5em', color: 'Gray' }
          : { fontSize: '1.5em', color: '#337ab7' }
      }
      name="shopping-cart"
      className="link"
    />
  </div>
);

const SearchResultItem = (props: {
  onChangePage: (change: ChangePage) => void;
  searchStore: SearchStoreState;
  onClickHeader: (hit: SearchHit) => void;
  onClickShoppingCart: (hit: SearchHit) => void;
  getObject: (hit: SearchHit) => ObjectData | undefined;
  getSampleTypeStr: (sample: SampleData) => string;
  isObjectAdded: (hit: SearchHit) => boolean;
  onClickBreadcrumb: (node: Node, isObject: boolean) => void;
  onClickAddAllToShoppingCart: (hit: Array<SearchHit>) => void;
}) => {
  console.log('SearchComponent > SearchResultItem > props', props.searchStore);
  const result = props.searchStore.result;
  if (result && result.hits && result.hits.total > 0) {
    const pagination = props.searchStore.pagination;
    return (
      <div>
        <SearchStats searchStore={props.searchStore} />

        {pagination && (
          <RightAlignedPagination paging={pagination} onChangePage={props.onChangePage} />
        )}

        {toggleAll(
          result.hits.hits,
          props.onClickShoppingCart,
          props.isObjectAdded,
          props.onClickAddAllToShoppingCart
        )}
        <RenderResultHits
          hits={result.hits.hits}
          onClickHeader={props.onClickHeader}
          onClickShoppingCart={props.onClickShoppingCart}
          getObject={props.getObject}
          getSampleTypeStr={props.getSampleTypeStr}
          isObjectAdded={props.isObjectAdded}
          onClickBreadcrumb={props.onClickBreadcrumb}
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
    <NavigateSearch
      appSession={props.appSession}
      history={props.history}
      disableObject={true}
    />
    <h1>{I18n.t('musit.objectsearch.title')}</h1>
    <SearchInputFormComponent
      onChange={props.onChangeQueryParam}
      search={props.onSearch}
      searchStore={props.searchStore}
      onClearSearch={props.onClearSearch}
    />
    <select
      id="pageSize"
      onChange={e => {
        e.preventDefault();
        localStorage.setItem('SearchPageSize', e.target.value);
        Number(e.target.value) === 10000 &&
          emitWarning({
            message: I18n.t('musit.texts.pageSizeMessage')
          });
      }}
    >
      <option selected disabled hidden>
        {localStorage.getItem('SearchPageSize') || 100}
      </option>
      <option>10</option>
      <option>100</option>
      <option>200</option>
      <option>500</option>
      <option>1000</option>
    </select>

    {props.searchStore && <Loader loaded={!props.searchStore.loading} />}
    {console.log('Props ', props)}
    {props.searchStore && !props.searchStore.loading && props.searchStore.result ? (
      <SearchResultItem
        searchStore={props.searchStore}
        onChangePage={props.onChangePage}
        onClickHeader={props.onClickHeader}
        onClickShoppingCart={props.onClickShoppingCart}
        getObject={props.getObject}
        getSampleTypeStr={props.getSampleTypeStr}
        isObjectAdded={props.isObjectAdded}
        onClickBreadcrumb={props.onClickBreadcrumb}
        onClickAddAllToShoppingCart={props.onClickAddAllToShoppingCart}
      />
    ) : (
      <div>{I18n.t('musit.search.ready')}</div>
    )}
  </div>
);

export default SearchComponent;
