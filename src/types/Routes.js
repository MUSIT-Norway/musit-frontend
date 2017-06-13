// @flow

export type HistoryPush = {
  pathname?: ?string,
  search?: ?string,
  state?: ?any
};

export type History = {
  /**
   * This signature isn't 100% correct, but I found some limitations in the flow typing
   * so I didn't find any way to type it.
   *
   * The push function has two signatures:
   * - (path: string: ?Array<any>) => void
   * - (obj: HistoryPush) => void
   */
  push: (path: string | HistoryPush, state: ?Array<any>) => void,
  replace: (path: string, state: ?Array<any>) => void,
  goBack: () => void,
  goForward: () => void
};
