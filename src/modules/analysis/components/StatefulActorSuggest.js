// @flow
import React from 'react';
import { ActorSuggest } from '../../../components/suggest/ActorSuggest';
import MusitActor from '../../../models/actor';
import type { AppSession } from '../../../types/appSession';
import type { Actor } from 'types/actor';

export type Props = {
  appSession: AppSession,
  onChange: (actorId: ?string) => void,
  value?: ?string
};

export type State = {
  name: ?string
};

export default class StatefulActorSuggest extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = { name: null };
  }

  render() {
    return (
      <ActorSuggest
        appSession={this.props.appSession}
        id="restrictions_requester"
        value={this.state.name || this.props.value || ''}
        placeHolder="Find actor"
        onChange={(actor: Actor) => {
          this.props.onChange(MusitActor.getActorId(actor));
          this.setState({ name: actor.fn });
        }}
      />
    );
  }
}
