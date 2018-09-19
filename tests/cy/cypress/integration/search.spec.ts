/// <reference types="cypress"/>
import * as constants from '../common/constants';
import { startup } from '../common/utils';
import { defaultContext } from '../common/constants';
import { MainPage } from '../pages/mainPage';

describe('My First Test', function() {
  /*
  it('Does not do much!!', function() {
    expect(true).to.equal(true);
  });
*/
  it('Search for objects', function() {
    startup();
    const mainPage = new MainPage(defaultContext);
    mainPage.visitSearchPage();
    /*
        window.localStorage.setItem(
        'accessToken',
        `{"accessToken":"${constants.accessToken}"}`
      );
  
      cy.visit('http://musit-test:8888');
  */
    /*
      cy.get(".loginButton").click();
      cy.wait(15000);
     // cy.click("#idplistextra");
     
      cy.get("#username").type("name");
      //cy.typeText("#password", "pw")
      //.click(Selector("button").withAttribute("type", "submit"));
      */
  });
});
