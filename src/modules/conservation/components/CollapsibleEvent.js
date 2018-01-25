// @flow
import React from 'react';
import FontAwesome from 'react-fontawesome';

type Props = {
  eventName?: string,
  eventComponent?: any,
  eventDefaultState?: boolean,
  expanded?: boolean,
  editMode?: boolean,
  index: number,
  toggleExpanded: Function
};

function borderStyle(editMode: boolean) {
  if (editMode) {
    return {
      borderColor: editMode ? '#618298' : '#d3d3d3',
      borderStyle: editMode ? 'groove' : 'initial',
      borderWidth: editMode ? 'thick' : 'initial'
    };
  }
}

export default function CollapsibleEvent(props: Props) {
  return (
    <div
      className="panel panel-default"
      style={{
        ...borderStyle(props.editMode || false),
        background: props.expanded ? '#ffffff' : '#e8e8e8'
      }}
    >
      <div onClick={props.toggleExpanded} style={{ padding: 10 }}>
        <h3>
          {props.eventName}
          <FontAwesome
            name={!props.expanded ? 'chevron-down' : 'chevron-up'}
            style={{ color: 'black', float: 'right' }}
          />
        </h3>
      </div>
      <div className={props.expanded ? 'collapse in' : 'collapse'}>
        {props.eventComponent}
      </div>
    </div>
  );
}
