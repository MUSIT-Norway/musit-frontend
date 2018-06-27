import * as React from 'react';
import { Button } from 'react-bootstrap';

interface LoginButtonProps {
  children?: JSX.Element;
  navigate?: Function;
}

/* Old:
  static propTypes = {
    children: PropTypes.element,
    navigate: PropTypes.func.isRequired
  };
*/

export default class LoginButton extends React.Component<LoginButtonProps> {
  static defaultProps = {
    navigate: (url: string) => (window.location.href = url)
  };

  render() {
    return (
      <Button
        className="loginButton"
        bsStyle="default"
        style={{ marginTop: '1em' }}
        height="20"
        onClick={() =>
          this.props.navigate && this.props.navigate('/api/auth/rest/authenticate')
        }
      >
        {this.props.children}
      </Button>
    );
  }
}
