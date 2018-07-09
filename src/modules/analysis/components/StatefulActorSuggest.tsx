// @flow
import * as React from 'react';
import { ActorSuggest } from '../../../components/suggest/ActorSuggest';
import MusitActor from '../../../models/actor';
import { AppSession } from '../../../types/appSession';
import { Actor } from '../../../types/actor';
import { I18n } from 'react-i18nify';
import { Maybe } from '../../../types/common';

export type Props = {
  id: string;
  appSession: AppSession;
  onChange: (actorId: Maybe<string>) => void;
  value?: Maybe<string>;
};

export type State = {
  name: Maybe<string>;
};

export default class StatefulActorSuggest extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { name: null };
  }

  render() {
    return (
      <ActorSuggest
        appSession={this.props.appSession}
        id={this.props.id}
        value={this.state.name || this.props.value || ''}
        placeHolder={I18n.t('musit.texts.findActor')}
        onChange={(actor: Actor) => {
          this.props.onChange(MusitActor.getActorId(actor));
          this.setState(() => ({ name: actor.fn }));
        }}
      />
    );
  }
}
