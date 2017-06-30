// @flow
export type DomEvent = {
  preventDefault: Function,
  target: { value: string, options?: Array<{ selected: boolean, value: string }> }
};
