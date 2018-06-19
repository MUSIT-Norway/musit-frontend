import * as React from 'react';
import { Button } from 'react-bootstrap';
import { MusitField } from '../formfields';
import * as FontAwesome from 'react-fontawesome';
import './Toolbar.css';
import { MouseEventHandler } from 'react';
import { TODO } from '../../types/common';

interface ToolbarProps {
  showLeft: boolean; // PropTypes.bool.isRequired,
  showCenter: boolean;
  showRight?: boolean;
  clickShowLeft: MouseEventHandler<TODO>; // PropTypes.func.isRequired,
  clickShowCenter: MouseEventHandler<TODO>; // PropTypes.func.isRequired,
  clickShowRight?: MouseEventHandler<TODO>; // PropTypes.func,
  labelLeft: string; // PropTypes.string.isRequired,
  labelCenter: string; //PropTypes.string.isRequired,
  labelRight?: string;
  placeHolderSearch: string;
  searchValue?: string;
  onSearchChanged?: Function;
  hideRight?: boolean;
}

/* OLD
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
*/

export default class Toolbar extends React.Component<ToolbarProps> {
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
