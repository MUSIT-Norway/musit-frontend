// @flow
import React from 'react';
import FontAwesome from 'react-fontawesome';

type Props = {
  eventName?: string,
  eventComponent?: any,
  eventDefaultState?: boolean,
  expanded?: boolean,
  index: number,
  toggleExpanded: Function
};

export default function CollapsibleEvent(props: Props) {
  return (
    <div className="panel panel-default">
      <div
        onClick={props.toggleExpanded}
        className="panel-heading"
        style={{ background: props.expanded ? '#ffffff' : '#e8e8e8' }}
      >
        <h3>
          {props.eventName}
          <FontAwesome
            name={!props.expanded ? 'chevron-up' : 'chevron-down'}
            style={{ color: 'black', float: 'right' }}
          />
        </h3>
      </div>
      <div className={props.expanded ? 'panel collapse in' : 'panel collapse'}>
        {props.eventComponent}
      </div>
    </div>
  );
}
