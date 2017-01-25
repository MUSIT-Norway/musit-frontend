
import React from 'react';
import { Button } from 'react-bootstrap';

export default class FeideButton extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }

  render() {
    return (
      <Button
        bsStyle="default"
        style={{ marginTop: '1em' }}
        height="20"
        onClick={() => {
          window.location.href='/api/auth/rest/authenticate';
        }}
      >
        {this.props.children}
      </Button>
    );
  }
}
