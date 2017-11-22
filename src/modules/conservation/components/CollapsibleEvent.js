// @flow
import React from 'react';
import { Button, Panel, Row, Col, Grid } from 'react-bootstrap';
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
    <div>
      <Panel
        style={{
          padding: '0',
          margin: '0',
          background: '#e8e8e8',
          fontSize: 18,
          fontWeight: 'bold'
        }}
        onClick={props.toggleExpanded}
      >
        {props.eventName}
        <FontAwesome
          name={!props.expanded ? 'chevron-up' : 'chevron-down'}
          style={{ color: 'black', float: 'right' }}
        />
      </Panel>
      <Panel collapsible expanded={props.expanded}>
        {props.eventComponent}
      </Panel>
    </div>
  );
}
