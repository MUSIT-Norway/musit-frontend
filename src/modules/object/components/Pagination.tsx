import * as React from 'react';

export type PaginationProps = {
  indexOfActivePage: number;
  pagesToShow: Array<number>;
  onPrev: (n: number) => void;
  onNext: (n: number) => void;
  onSetActivePage: (i: number) => void;
  pageSize: number;
  pageNumToShow: number;
  totalPageNum: number;
};

export const Pagination = (p: PaginationProps) => {
  return (
    <ul className="pagination">
      <li className="previous" onClick={() => p.onPrev(p.pageNumToShow)}>
        Previous
      </li>
      {p.pagesToShow[0] > 0 ? (
        <div>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                p.onSetActivePage(0);
              }}
            >
              1
            </a>
          </li>
          <li>...</li>
          {p.pagesToShow.map((n: number) => (
            <li>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  p.onSetActivePage(n);
                }}
              >
                {n + 1}
              </a>
            </li>
          ))}
        </div>
      ) : (
        p.pagesToShow.map((n: number) => (
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                p.onSetActivePage(n);
              }}
            >
              {n + 1}
            </a>
          </li>
        ))
      )}

      <li className="next" onClick={() => p.onNext(p.pageNumToShow)}>
        Next
      </li>
    </ul>
  );
};
