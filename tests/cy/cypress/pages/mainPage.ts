/// <reference types="cypress"/>

import { Context, constructUrl } from '../common/utils';

export class MainPage {
  constructor(readonly context: Context) {}
  /*
    visit() {
      cy.visit('/');
    }
  */
  /*
    get searchButton() {
      return cy.get(this.urlProvider.constructUrl("search/objects"));
    }
    */
  visitSearchPage() {
    return cy.visit(constructUrl(this.context, 'search/objects'));
  }
}
