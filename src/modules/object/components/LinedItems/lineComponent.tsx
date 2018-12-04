import * as React from 'react';

export type LinedItemsProps = {
  items?: Element[];
  lineLabel?: string;
  title: string;
};

export const LinedItems = (props: LinedItemsProps) => (
  <div className="container form-group">
    <h1>{props.title}</h1>
    <div className="item label">Hei</div>
    <div className="item">
      <label htmlFor="bjarne">Navn</label>
      <input className="form-control" value="Bjarne" id="bjarne" />
    </div>
  </div>
);
