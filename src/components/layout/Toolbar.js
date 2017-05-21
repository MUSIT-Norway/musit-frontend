import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { MusitField } from '../formfields';
import FontAwesome from 'react-fontawesome';
import './Toolbar.css';

export default class Toolbar extends React.Component {
  static propTypes = {
    showLeft: PropTypes.bool.isRequired,
    showRight: PropTypes.bool.isRequired,
    clickShowLeft: PropTypes.func.isRequired,
    clickShowRight: PropTypes.func.isRequired,
    labelLeft: PropTypes.string.isRequired,
    labelRight: PropTypes.string.isRequired,
    placeHolderSearch: PropTypes.string,
    searchValue: PropTypes.string,
    onSearchChanged: PropTypes.func
  };

  render() {
    let optionalSearch;
    const {
      placeHolderSearch,
      onSearchChanged,
      searchValue,
      showLeft,
      labelLeft,
      clickShowLeft,
      showRight,
      labelRight,
      clickShowRight
    } = this.props;
    if (onSearchChanged) {
      optionalSearch = (
        <div className="searchField">
          <MusitField
            style={{ width: '200px', zIndex: 'inherit' }}
            id={'search'}
            addOnPrefix={'\u2315'}
            placeHolder={placeHolderSearch}
            value={searchValue}
            validate="text"
            onChange={onSearchChanged}
          />
        </div>
      );
    } else {
      optionalSearch = (
        <div className="searchField">
          <span style={{ width: '180px', display: 'inline-block' }}>{' '}</span>
        </div>
      );
    }
    return (
      <div className="wrapper">
        {optionalSearch}
        <div className="toolBarButtons">
          <Button active={showLeft} onClick={clickShowLeft}>
            <FontAwesome name={showLeft ? 'check-square-o' : 'square-o'} />
            {' '}
            {labelLeft}
          </Button>
          <Button active={showRight} onClick={clickShowRight}>
            <FontAwesome name={showRight ? 'check-square-o' : 'square-o'} />
            {' '}
            {labelRight}
          </Button>
        </div>
      </div>
    );
  }
}
