import React from 'react';
import inject from 'react-rxjs/dist/RxInject';
import { hashHistory } from 'react-router';
import {refreshSession} from './modules/app/appSession';

export class Init extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children;
  }

  componentWillReceiveProps(next) {
    const sessionLoaded = Init.isSessionLoaded(next.appSession);
    const sessionStatesNotEqual = next.appSession.state !== this.props.appSession.state;
    if (sessionLoaded && sessionStatesNotEqual) {
      console.log('call refresh');
      refreshSession(this.props.params, this.props.appSession, this.props.goTo);
    }
  }
}

Init.isSessionLoaded = (appSession) => {
  return !!appSession.getBuildNumber();
};


const data = {
  appSession$: {
    type: React.PropTypes.object.isRequired
  }
};
const props = { goTo: hashHistory.push.bind(hashHistory)};
const commands = {refreshSession: refreshSession()};

export default inject(data, commands, props)(Init);