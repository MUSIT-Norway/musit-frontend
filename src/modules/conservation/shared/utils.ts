import { Maybe } from '../../../types/common';

// @flow

type FormType = {
  events: {
    rawValue: Array<string>;
  };
};
export const getFormEvents = (form: Maybe<FormType>) =>
  form && form.events && form.events.rawValue && form.events.rawValue.length > 0
    ? form.events.rawValue
    : [];

type FileType = [
  {
    fid: string;
  }
];
export const getFids = (Files?: Maybe<FileType>) =>
  Files && Files.filter(f => f.fid) ? Files.filter(f => f.fid).map(f => f.fid) : [];
