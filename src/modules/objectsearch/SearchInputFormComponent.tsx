// @flow

import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import {
  validateNumberRangeField,
  removeInvalidKeysForNumberRangeString
} from '../../shared/validation';
import { SearchStoreState } from '../../search/searchStore';
import { emitWarning } from '../../shared/errors';
import { TODO } from '../../types/common';

const SearchParam = (props: TODO) => (
  <div className={'form-group col-md-' + (props.md || 3)}>
    {console.log('SearchInputFormComponent > SearchParam > props', props)}
    <label className="control-label" htmlFor={'search-' + props.id}>
      {I18n.t(`musit.objectsearch.${props.id}.label`)}
    </label>{' '}
    <input
      id={'search-' + props.id}
      className="form-control"
      // style={{ ...style }}
      type="text"
      value={
        props && props.searchStore && props.searchStore.queryParam
          ? props.id === 'museumNoAsANumber'
            ? removeInvalidKeysForNumberRangeString(
                props.searchStore.queryParam.museumNoAsANumber
                  ? props.searchStore.queryParam.museumNoAsANumber
                  : localStorage.getItem(props.id)
                    ? localStorage.getItem(props.id)
                    : ''
              )
            : props.searchStore.queryParam[props.id]
              ? props.searchStore.queryParam[props.id]
              : localStorage.getItem(props.id)
                ? localStorage.getItem(props.id)
                : ''
          : localStorage.getItem(props.id)
            ? localStorage.getItem(props.id)
            : ''
      }
      placeholder={I18n.t(`musit.objectsearch.${props.id}.placeHolder`)}
      onChange={e => {
        localStorage.setItem(props.id, e.target.value || '');
        props.onChange(
          props.id,
          props.id === 'museumNoAsANumber'
            ? removeInvalidKeysForNumberRangeString(e.target.value)
            : e.target.value
        );
      }}
      // ref={field => (this[id] = ReactDOM.findDOMNode(field))}
    />
  </div>
);

export type Props = {
  onChange: (name: string, value: string) => void;
  search: (databaseSearch: boolean) => void;
  searchStore: SearchStoreState;
  onClearSearch: () => void;
};

const SearchInputFormComponent = (props: Props) => (
  <form>
    {console.log('SearchInputFormComponent > props', props)}
    <div className="row">
      <SearchParam
        id="museumNo"
        onChange={props.onChange}
        searchStore={props.searchStore}
        md={2}
      />
      <SearchParam
        id="museumNoAsANumber"
        onChange={props.onChange}
        searchStore={props.searchStore}
        md={2}
      />
      <SearchParam
        id="subNo"
        onChange={props.onChange}
        searchStore={props.searchStore}
        md={2}
      />
    </div>
    <div className="row">
      <SearchParam
        id="term"
        onChange={props.onChange}
        searchStore={props.searchStore}
        md={2}
      />
      <SearchParam
        id="q"
        onChange={props.onChange}
        searchStore={props.searchStore}
        md={4}
      />
      <button
        className="btn btn-default pull-right"
        style={{ marginRight: '20px', marginTop: '40px' }}
        type="submit"
        onClick={e => {
          e.preventDefault();
          return validateNumberRangeField(
            props &&
              props.searchStore &&
              props.searchStore.queryParam &&
              props.searchStore.queryParam.museumNoAsANumber
          )
            ? props.search(true)
            : emitWarning({
                message: I18n.t('musit.texts.numberRangeMessage')
              });
        }}
      >
        <FontAwesome name="database" style={{ fontSize: '1.3em' }} />
        <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
      </button>
      <button
        id="executeSearch"
        className="btn btn-default pull-right"
        style={{ marginRight: '20px', marginTop: '40px' }}
        type="submit"
        onClick={e => {
          e.preventDefault();
          return validateNumberRangeField(
            props &&
              props.searchStore &&
              props.searchStore.queryParam &&
              props.searchStore.queryParam.museumNoAsANumber
          )
            ? props.search(false)
            : emitWarning({
                message: I18n.t('musit.texts.numberRangeMessage')
              });
        }}
      >
        <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
      </button>
      <button
        className="btn btn-default pull-right"
        style={{ marginRight: '20px', marginTop: '40px' }}
        onClick={e => {
          e.preventDefault();
          localStorage.setItem('museumNo', '');
          localStorage.setItem('museumNoAsANumber', '');
          localStorage.setItem('subNo', '');
          localStorage.setItem('term', '');
          localStorage.setItem('q', '');
          return props.onClearSearch();
        }}
      >
        {I18n.t('musit.texts.clearSearch')}
      </button>
    </div>
  </form>
);

export default SearchInputFormComponent;
