// @flow

/**
 * Usage:
 *
 * const promiseHelper = new StatefulPromise();
 * callMethodThatRequiresAFunctionThatReturnsAPromise(promiseHelper.createPromise())
 *   .then(() => {
 *     expect(promiseHelper.value).toEqual('SOme wierd stuff');
 *   });
 */
export default class StatefulPromise {
  params: any;
  data: ?any;

  createPromise(data: ?any) {
    return (params: any) =>
      new Promise((resolve: (v: any) => void) => {
        this.params = params;
        this.data = data;
        resolve(data || params);
      });
  }
}
