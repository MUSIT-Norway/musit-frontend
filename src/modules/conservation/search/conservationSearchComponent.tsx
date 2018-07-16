// @flow

import React from 'react';
import Pagination from '../../../search/components/pagination';
import SearchStats from '../../../search/components/SearchStats';
import { I18n } from 'react-i18nify';
import ConservationInputFormComponent from './ConservationInputFormComponent';
import type { SearchHit } from 'types/search';
import type { SearchStoreState, ChangePage } from '../../../search/searchStore';
import './conservationSearchComponent.css';
import moment from 'moment';
import pullRight from '../../../shared/pullRight';
import FontAwesome from 'react-fontawesome';
import { conservationProcessTypeId } from '../../../shared/util';
import Loader from 'react-loader';
import NavigateSearch from '../../../search/NavigateSearch';
import type { AppSession } from '../../../types/appSession';

const DateFormat = 'DD.MM.YYYY HH:mm';

export type Methods = {
  getConservationTypeText: (id: number) => ?string,
  goToConservation: (id: number, subEventId: number) => void
};

export type ConservationSearchComoponentProps = {
  onSearch: () => void,
  onChangeQueryParam: (name: string, value: string) => void,
  onChangePage: (page: ChangePage) => void,
  searchStore: SearchStoreState,
  history: () => void,
  appSession: AppSession
} & Methods;

export type ResultHitProps = {
  icon: string,
  header: string,
  metaInfo: Array<string | React$Node>,
  onClickHeader: () => void
};

const ConservationResultHit = (props: ResultHitProps) => {
  return (
    <div className="media musit__media--search">
      <div className="media-left">
        <FontAwesome name={props.icon} style={{ fontSize: '1.3em' }} />
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

const getResultHitProps = (
  props: {
    hit: SearchHit
  } & Methods
): ResultHitProps => {
  if (props && props.hit && props.hit._source) {
    const source = props.hit._source;
    const type = props.getConservationTypeText(source.eventTypeId);
    const dateText = moment(source.registeredDate).format(DateFormat);
    return {
      icon: 'bank',
      header: `${I18n.t('musit.conservation.conservation')} - ${type || ''}`,
      metaInfo: [
        source.eventTypeId === conservationProcessTypeId
          ? I18n.t('musit.conservation.caseNumber') + ': ' + source.caseNumber
          : I18n.t('musit.conservation.note') + ': ' + source.note,
        I18n.t('musit.texts.dateRegistered') + ': ' + dateText
      ],
      onClickHeader: () => props.goToConservation(source.partOf, source.id)
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
  const goToConservation = props.goToConservation;
  const getConservationTypeText = props.getConservationTypeText;
  return (
    <div>
      {props.hits.map(hit => {
        const props = getResultHitProps({
          hit,
          getConservationTypeText,
          goToConservation
        });
        return <ConservationResultHit key={hit._id} {...props} />;
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
          goToConservation={props.goToConservation}
          getConservationTypeText={props.getConservationTypeText}
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

const ConservationSearchComponent = (props: ConservationSearchComoponentProps) => (
  <div className="container">
    <NavigateSearch
      appSession={props.appSession}
      history={props.history}
      disableConservation={true}
    />

    <h1>{I18n.t('musit.conservation.search')}</h1>

    <ConservationInputFormComponent
      onChangeQueryParam={props.onChangeQueryParam}
      onSearch={props.onSearch}
      searchStore={props.searchStore}
    />

    {props.searchStore && <Loader loaded={!props.searchStore.loading} />}
    {!props.searchStore.loading && props.searchStore.result ? (
      <SearchResultItem
        searchStore={props.searchStore}
        onChangePage={props.onChangePage}
        getConservationTypeText={props.getConservationTypeText}
        goToConservation={props.goToConservation}
      />
    ) : (
      <div>{I18n.t('musit.search.ready')}</div>
    )}
  </div>
);

export default ConservationSearchComponent;
