import React from 'react';
import { Button } from 'react-bootstrap';

export default class FeideButton extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    navigate: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    navigate: (url) => window.location.href = url
  }

  render() {
    return (
      <Button
        className="loginButton"
        bsStyle="default"
        style={{ marginTop: '1em' }}
        height="20"
        onClick={() => this.props.navigate('/api/auth/rest/authenticate')}
      >
        {this.props.children}
      </Button>
    );
  }
}
