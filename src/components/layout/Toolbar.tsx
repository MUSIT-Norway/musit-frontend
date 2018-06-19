import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { MusitField } from '../formfields';
import FontAwesome from 'react-fontawesome';
import './Toolbar.css';

export default class Toolbar extends React.Component {
  static propTypes = {
    showLeft: PropTypes.bool.isRequired,
    showCenter: PropTypes.bool,
    showRight: PropTypes.bool,
    clickShowLeft: PropTypes.func.isRequired,
    clickShowCenter: PropTypes.func.isRequired,
    clickShowRight: PropTypes.func,
    labelLeft: PropTypes.string.isRequired,
    labelCenter: PropTypes.string.isRequired,
    labelRight: PropTypes.string,
    placeHolderSearch: PropTypes.string,
    searchValue: PropTypes.string,
    onSearchChanged: PropTypes.func,
    hideRight: PropTypes.bool
  };

  static defaultProps = {
    hideRight: false
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
      showCenter,
      labelCenter,
      clickShowCenter,
      showRight,
      labelRight,
      clickShowRight,
      hideRight
    } = this.props;
    if (onSearchChanged) {
      optionalSearch = (
        <div className="searchField">
          <MusitField
            style={{ width: '150px', zIndex: 'inherit' }}
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
          <span style={{ width: '150px', display: 'inline-block' }}> </span>
        </div>
      );
    }
    return (
      <div className="wrapper">
        {optionalSearch}
        <div className="toolBarButtons">
          <Button active={showLeft} onClick={clickShowLeft}>
            <FontAwesome name={showLeft ? 'check-square-o' : 'square-o'} /> {labelLeft}
          </Button>
          <Button active={showCenter} onClick={clickShowCenter}>
            <FontAwesome name={showCenter ? 'check-square-o' : 'square-o'} />{' '}
            {labelCenter}
          </Button>
          {!hideRight && (
            <Button active={showRight} onClick={clickShowRight}>
              <FontAwesome name={showRight ? 'check-square-o' : 'square-o'} />{' '}
              {labelRight}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
