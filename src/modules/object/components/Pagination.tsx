import * as React from 'react';

export type PaginationProps = {
  indexOfActivePage: number;
  indexOfActivePageList: number;
  pages: number[][];
  onPrev: () => void;
  onNext: (maxPageListIndex: number) => void;
  onClickActivePage: (i: number) => void;
  pageSize: number;
  numPagesToShow: number;
};

export const Pagination = (p: PaginationProps) => {
  const activePageList = p.pages[p.indexOfActivePageList];
  return (
    <ul className="pagination">
      <li className="previous">
        <a href="#" onClick={() => p.onPrev()}>
          Prev
        </a>
      </li>
      {activePageList &&
        activePageList.map((pl, i) => (
          <li key={`LI-${i}`} className={i === p.indexOfActivePage ? 'active' : ''}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                console.log(pl);
                p.onClickActivePage(pl);
              }}
            >
              {pl + 1}
            </a>
          </li>
        ))}

      <li className="next">
        <a href="#" onClick={() => p.onNext(p.pages.length - 1)}>
          Next
        </a>
      </li>
    </ul>
  );
};
export default Pagination;
