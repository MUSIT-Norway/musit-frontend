/// <reference types="cypress"/>
import * as constants from './constants';

export function startup() {
  window.localStorage.setItem(
    'accessToken',
    `{"accessToken":"${constants.accessToken}"}`
  );

  cy.visit('/');
}


export type Context = {
  museumId: number;
  collection: string;
};

export function constructUrl(context: Context, postfix: string) {
      return `/museum/${context.museumId}/collections/${context.collection}/${postfix}`;
}

/* I found the body of these two functions here:
https://github.com/cypress-io/cypress/issues/549
*/

/** Selects a given value in a React Select component.
 * 
Note: ReactSelect_selectOptionWithText doesn't seem to work properly when dynamically reloading 
the test while coding. You need to press 'refresh' ('run all tests') inside the cypress test window to get it to work properly.

So please default to reactSelect_selectFirstOption if you just want to select something.
**/

export function reactSelect_selectOptionWithText(
  id: string,
  value: string,
  context: string = 'body'
) {
  //const selector = `#${id} .Select-control`; //:first
  const selector = `${context} #${id} .Select-control`; //:first
  //alert(selector);
  cy.get(selector)
    .click()
    .get(`.Select-option:contains(${value})`)
    .click();
}

/** Selects the first value in a React Select component
 *
 * */
export function reactSelect_selectFirstOption(id: string, context: string = 'body') {
  const selector = `${context} #${id} .Select input`; //:first

  cy.get(selector)
    .first()
    // It will show all the options
    .type(' ', { force: true })
    .get('.Select-option')
    .first()
    .click();
}

/* Get first element of a dropdown list  */

export function dropDownList_getFirstElement(id: string){
  cy.get(`#${id}`)
  .first();
}


/** A function which returns a value which should be unique locally (on this machine only).
 * Currently we simply return a timestamp, so we assume it isn't called *very* frequently.
 * Meant to be used for making unique names (like added as a postfix) to be inserted into the database during tests.
 *
 */
export function locallySemiUniqueString() {
  return new Date().toISOString();
}


/* Old

export class UrlProvider {
  readonly museumId: number;
  readonly collection: string;

  constructor(context: Context) {
    this.museumId = context.museumId;
    this.collection = context.collection;
  }

  public constructUrl(postfix: string): string {
    return `/museum/${this.museumId}/collections/${this.collection}/${postfix}`;
  }
}

*/