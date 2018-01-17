import React from 'react';
import { I18n } from 'react-i18nify';
import type { NoteProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function Note(props: NoteProps) {
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.note}
      eventName={I18n.t('musit.conservation.events.note.noteEvent')}
      noteLabel={I18n.t('musit.conservation.events.note.note')}
    />
  );
}
