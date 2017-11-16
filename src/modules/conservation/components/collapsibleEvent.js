// @flow
import React from 'react';
import { Button, Panel, Row, Col, Grid } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type Props = {
  eventName?: string,
  eventComponent?: any,
  eventDefaultState?: boolean
};

type State = {
  expanded: boolean
};

export default class CollapsibleEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: !this.props.eventDefaultState
    };
  }

  handleOnClick() {
    this.setState({ expanded: this.state.expanded ? false : true });
  }

  downButton() {
    return (
      <Button onClick={() => this.handleOnClick()} bsStyle="link">
        <FontAwesome
          name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
          style={{ color: 'black' }}
        />
      </Button>
    );
  }

  render() {
    return (
      <div>
        <Panel
          style={{ padding: '0', margin: '0', background: '#e8e8e8', fontWeight: 'bold' }}
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          {this.props.eventName}
          <FontAwesome
            name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
            style={{ color: 'black', float: 'right' }}
          />
        </Panel>
        <Panel collapsible expanded={this.state.expanded}>
          {this.props.eventComponent}
        </Panel>
      </div>
    );
  }
}
