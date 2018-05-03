// @flow

import React from 'react';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import {
  validateNumberRangeField,
  removeInvalidKeysForNumberRangeString
} from '../../shared/validation';
import type { SearchStoreState } from '../../search/searchStore';
import { emitWarning } from '../../shared/errors';

const SearchParam = props => (
  <div className="form-group col-md-3">
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
        props && props.searchStore && props.searchStore.queryParam ? props.id ===
        'museumNoAsANumber' ? (
          removeInvalidKeysForNumberRangeString(
            props.searchStore.queryParam.museumNoAsANumber
          )
        ) : (
          props.searchStore.queryParam[props.id] || ''
        ) : (
          ''
        )
      }
      placeholder={I18n.t(`musit.objectsearch.${props.id}.placeHolder`)}
      onChange={e =>
        props.onChange(
          props.id,
          props.id === 'museumNoAsANumber'
            ? removeInvalidKeysForNumberRangeString(e.target.value)
            : e.target.value
        )}
      // ref={field => (this[id] = ReactDOM.findDOMNode(field))}
    />
  </div>
);

export type Props = {
  onChange: (name: string, value: string) => void,
  search: () => void,
  searchStore: SearchStoreState
};

const SearchInputFormComponent = (props: Props) => (
  <form>
    {console.log('SearchInputFormComponent > props', props)}
    <div className="row">
      <SearchParam
        id="museumNo"
        onChange={props.onChange}
        searchStore={props.searchStore}
      />
      <SearchParam
        id="museumNoAsANumber"
        onChange={props.onChange}
        searchStore={props.searchStore}
      />
      <SearchParam id="subNo" onChange={props.onChange} searchStore={props.searchStore} />
      <SearchParam id="term" onChange={props.onChange} searchStore={props.searchStore} />
      <SearchParam id="q" onChange={props.onChange} searchStore={props.searchStore} />
      <button
        className="btn btn-default pull-right"
        style={{ marginRight: '20px' }}
        type="submit"
        onClick={e => {
          e.preventDefault();
          validateNumberRangeField(
            props &&
              props.searchStore &&
              props.searchStore.queryParam &&
              props.searchStore.queryParam.museumNoAsANumber
          )
            ? props.search()
            : emitWarning({
                message: I18n.t('musit.texts.numberRangeMessage')
              });
        }}
      >
        <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
      </button>
    </div>
  </form>
);

export default SearchInputFormComponent;
