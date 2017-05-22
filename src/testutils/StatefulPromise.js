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
  value: any;

  createPromise() {
    return (value: any) =>
      new Promise((resolve: any => void) => {
        this.value = value;
        resolve(value);
      });
  }
}
