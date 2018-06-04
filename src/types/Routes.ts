// @flow

//I removed this and instead use the standard react-router history API wrapper

// export type HistoryPush = {
//   pathname?:Maybe<string>,
//   search?:Maybe<string>,
//   state?: Maybe<any>
// };

// export type History = {
//   /**
//    * This signature isn't 100% correct, but I found some limitations in the flow typing
//    * so I didn't find any way to type it.
//    *
//    * The push function has two signatures:
//    * - (path: string: ?Array<any>) => void
//    * - (obj: HistoryPush) => void
//    */
//   push: (path: string | HistoryPush, state?: Array<any>) => void,
//   replace: (path: string, state: Maybe<Array<any>>) => void,
//   goBack: () => void,
//   goForward: () => void
// };

export type Match<P> = {
  isExact: boolean;
  params: P;
  path: string;
  url: string;
};
