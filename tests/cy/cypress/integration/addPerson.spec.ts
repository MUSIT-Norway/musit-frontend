/// <reference types="cypress"/>
import * as constants from '../common/constants';
import {
  startup,
  locallySemiUniqueString,
  reactSelect_selectOptionWithText,
  reactSelect_selectFirstOption
} from '../common/utils';
import { defaultContext } from '../common/constants';
import { MainPage } from '../pages/mainPage';
import { PersonAddPage } from '../pages/person/personAddPage';

describe('PersonAdd', function() {
  it('Add person', function() {
    startup();
    const lastName = 'Duck-' + locallySemiUniqueString();

    const page = new PersonAddPage(defaultContext);
    page.visit();
    page.titleField.type('Mr. ');
    page.firstNameField.type('Donald');
    page.lastNameField.type(lastName);

    //reactSelect_selectOptionWithText('collectionsForPerson', 'KHM-Arkeologi');

    reactSelect_selectFirstOption('collectionsForPerson');

    page.saveOrEditButton.click();
    page.saveOrEditButton.should('contain', 'Edit');

    page.titleField.should('have.value', 'Mr. '); //Should we expect the app to trim the space here?
    page.firstNameField.should('have.value', 'Donald');
    page.lastNameField.should('have.value', lastName);

    page.saveOrEditButton.click();
    cy.wait(500); //A small pause here seemed to be needed once, but perhaps not anymore?
    page.addSynonymButton.click();

    page.synonymTitleField.type('Mr. ');
    page.synonymFirstNameField.type('Donald');
    page.synonymLastNameField.type('Duck');
    page.saveSynonymButton.click();

    page.addExternalIdButton.click();
    page.externalIdsField.type('http://disney.com/donald');

    reactSelect_selectOptionWithText('databases', 'Scopus');

    page.saveExternalIdButton.click();

    page.saveOrEditButton.click();
  });
});
