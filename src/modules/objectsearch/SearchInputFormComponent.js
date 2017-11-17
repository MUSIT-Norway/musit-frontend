// @flow

import React from 'react';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

const SearchParam = props => (
  <div className="form-group col-md-3">
    <label className="control-label" htmlFor={'search-' + props.id}>
      {I18n.t(`musit.objectsearch.${props.id}.label`)}
    </label>{' '}
    <input
      id={'search-' + props.id}
      className="form-control"
      // style={{ ...style }}
      type="text"
      placeholder={I18n.t(`musit.objectsearch.${props.id}.placeHolder`)}
      onChange={e => props.onChange(props.id, e.target.value)}
      // ref={field => (this[id] = ReactDOM.findDOMNode(field))}
    />
  </div>
);

export type Props = {
  onChange: (name: string, value: string) => void,
  search: () => void
};

const SearchInputFormComponent = (props: Props) => (
  <form>
    <div className="row">
      <SearchParam id="museumNo" onChange={props.onChange} />
      <SearchParam id="subNo" onChange={props.onChange} />
      <SearchParam id="term" onChange={props.onChange} />
      <SearchParam id="q" onChange={props.onChange} />
      <button
        className="btn btn-default pull-right"
        style={{ marginRight: '20px' }}
        type="submit"
        onClick={e => {
          e.preventDefault();
          props.search();
        }}
      >
        <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
      </button>
    </div>
  </form>
);

export default SearchInputFormComponent;
