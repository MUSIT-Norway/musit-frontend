// @flow

import * as React from 'react';
import * as cx from 'classnames';

import { Paging, ChangePage } from '../searchStore';

export type Props = {
  paging: Paging;
  onChangePage: (page: ChangePage) => void;
};

const Pagination = (props: Props) => {
  const paging = props.paging;
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={cx({ disabled: paging.currentPage === 1 })}>
          <span
            onClick={() => {
              if (paging.currentPage !== 1) props.onChangePage('previous');
            }}
          >
            <span>&laquo;</span>
          </span>
        </li>

        {paging.showPages.map(pageNum => (
          <li key={pageNum} className={cx({ active: paging.currentPage === pageNum })}>
            {paging.currentPage === pageNum ? (
              <span className="active">{pageNum}</span>
            ) : (
              <span onClick={() => props.onChangePage(pageNum)}>{pageNum}</span>
            )}
          </li>
        ))}

        <li className={cx({ disabled: paging.currentPage === paging.totalPages })}>
          <span
            onClick={() => {
              if (paging.currentPage !== paging.totalPages) props.onChangePage('next');
            }}
          >
            <span>&raquo;</span>
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
