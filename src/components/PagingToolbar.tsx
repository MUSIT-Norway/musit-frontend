import * as React from 'react';
import { range } from 'lodash';
import { TODO, MUSTFIX } from '../types/common';

interface PagingToolbarProps {
  currentPage: string | number; // PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  numItems: number; //PropTypes.number.isRequired,
  perPage: number; // PropTypes.number,
  onClick: Function; //PropTypes.func.isRequired
}

/* OLD:

PagingToolbar.propTypes = {
  currentPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  numItems: PropTypes.number.isRequired,
  perPage: PropTypes.number,
  onClick: PropTypes.func.isRequired
};
*/

class PagingToolbar extends React.Component<PagingToolbarProps> {
  render() {
    const numPages = Math.ceil(this.props.numItems / this.props.perPage);
    const currentPage = parseInt(this.props.currentPage as TODO, 10);
    const maxPages = 10;
    const min = currentPage - maxPages + 1 > 1 ? currentPage : 1;
    const max = min + maxPages - 1 >= numPages ? numPages : min + maxPages - 1;

    return (
      <div
        style={{
          float: 'right'
        }}
      >
        <span
          style={{
            fontWeight: 'bold'
          }}
        >
          {currentPage > 1 ? (
            <a
              href="/page/back"
              onClick={e => {
                e.preventDefault();
                this.props.onClick(currentPage - 1);
              }}
            >
              {'<'}
            </a>
          ) : (
            '<'
          )}
        </span>
        {min > 1 ? (
          <a
            href={`/page/${min}`}
            onClick={e => {
              e.preventDefault();
              this.props.onClick(min - maxPages > 1 ? min - maxPages : 1);
            }}
          >
            {' .. '}
          </a>
        ) : null}
        {range(min, max + 1).map((page, i) => {
          return (
            <span
              key={i}
              style={{
                padding: '5px'
              }}
            >
              {currentPage === page ? (
                page
              ) : (
                <a
                  href={`/page/${page}`}
                  onClick={e => {
                    e.preventDefault();
                    this.props.onClick(page);
                  }}
                >
                  {page}
                </a>
              )}
            </span>
          );
        })}
        <span
          style={{
            fontWeight: 'bold'
          }}
        >
          {numPages > max ? (
            <a
              href={`/page/${max + 1}`}
              onClick={e => {
                e.preventDefault();
                this.props.onClick(max + 1);
              }}
            >
              {' .. '}
            </a>
          ) : null}
          {numPages > 1 && currentPage < numPages ? (
            <a
              href="/page/next"
              onClick={e => {
                e.preventDefault();
                this.props.onClick(currentPage + 1);
              }}
            >
              {'>'}
            </a>
          ) : (
            '>'
          )}
        </span>
      </div>
    );
  }
}

(PagingToolbar as MUSTFIX).defaultProps = {
  perPage: 50
};

export default PagingToolbar;
