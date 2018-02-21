// @flow

type FormType = {
  events: {
    rawValue: Array<string>
  }
};
export const getFormEvents = (form: ?FormType) =>
  form && form.events && form.events.rawValue && form.events.rawValue.length > 0
    ? form.events.rawValue
    : [];

type FileType = [
  {
    fid: string
  }
];
export const getFids = (Files?: ?FileType) =>
  Files && Files.filter(f => f.fid)
    ? Files.filter(f => f.fid).map(f => f.fid)
    : [];

