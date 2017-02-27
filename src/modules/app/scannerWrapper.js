import React, { PropTypes } from 'react';

const initScanner = (processBarcode) => (Component) => {
  return class Wrapper extends React.Component {

    static propTypes = {
      clearScanner: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.state = { scannerEnabled: false };
      this.toggleScanner = this.toggleScanner.bind(this);
    }

    enableScanner() {
      this.disableScanner();
      this.scanner = this.props.subscribeToScanner((barCode) => {
        this.props.clearScanner();
        processBarcode(barCode, this.props);
      });
    }

    disableScanner() {
      if (this.scanner) {
        this.scanner.unsubscribe();
      }
    }

    toggleScanner() {
      const scannerEnabled = !this.state.scannerEnabled;
      this.setState({...this.state, scannerEnabled});
      if (scannerEnabled) {
        this.enableScanner();
      } else {
        this.disableScanner();
      }
    }

    componentWillUnmount() {
      this.disableScanner();
    }

    render() {
      return <Component {...this.props} {...this.state} toggleScanner={this.toggleScanner} />;
    }
  };
};

export default initScanner;