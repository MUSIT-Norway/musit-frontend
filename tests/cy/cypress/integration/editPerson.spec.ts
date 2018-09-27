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
import { Context, constructUrl } from '../common/utils';

describe('PersonEdit', function() {
  it('Edit person', function() {
    startup();
    const lastName = 'Doodle' + locallySemiUniqueString();

    // Create person for testing changes
    const page = new PersonAddPage(defaultContext);
    page.visit();
    page.titleField.type('Mr.');
    page.firstNameField.type('Kendrick');
    page.lastNameField.type(lastName);

    //reactSelect_selectOptionWithText('collectionsForPerson', 'KHM-Arkeologi');

    reactSelect_selectFirstOption('collectionsForPerson');

    page.saveOrEditButton.click();
    //cy.get('#saveOrEdit');
    //console.log('SGG', myurl);
    page.saveOrEditButton.should('contain', 'Edit');

    // Get uuid for person from url to construct url for edit-endpoint, and visit edit-page
    cy.url().then(u => {
      const url = u.toString();
      const uuid = url.substr(url.lastIndexOf('/') + 1);
      const urlMod = constructUrl(defaultContext, `person/edit/${uuid}`);
      console.log('Modified url: ', urlMod);
      cy.visit(urlMod);
    });

    // Shoud be on edit-page
    page.saveOrEditButton.should('contain', 'Save');
    page.titleField.should('have.value', 'Mr.'); //Should we expect the app to trim the space here?
    page.firstNameField.should('have.value', 'Kendrick');
    page.lastNameField.should('have.value', lastName);

    page.addSynonymButton.should('not.be.empty').then(x => {
      page.addSynonymButton.click();
      page.synonymTitleField.type('Mr.');
      page.synonymFirstNameField.type('K');
      page.synonymLastNameField.type(lastName);
      page.saveSynonymButton.click();
    });
    //cy.wait(10000); //A small pause here seemed to be needed once, but perhaps not anymore?
    //page.addSynonymButton.click();

    page.addExternalIdButton.should('not.be.empty').then(x => {
      page.addExternalIdButton.click().then(y => {
        page.externalIDTableBody.should('not.be.empty');
        page.externalIdsField.type('http://disney.com/donald');
        reactSelect_selectOptionWithText('databases', 'Scopus');
        page.saveExternalIdButton.click();
      });
    });

    page.saveOrEditButton.click().then(x => {
      page.saveOrEditButton.should('contain', 'Edit');
    });
    page.firstNameField.should('have.value', 'Kendrick');
    page.saveOrEditButton.click().then(x => {
      page.saveOrEditButton.should('contain', 'Save');
    });
    page.firstNameField.should('have.value', 'Kendrick');
    page.firstNameField.type('s');

    page.saveOrEditButton.click();
    page.saveOrEditButton.should('contain', 'Edit');
    page.firstNameField.should('have.value', 'Kendricks');
  });
});
