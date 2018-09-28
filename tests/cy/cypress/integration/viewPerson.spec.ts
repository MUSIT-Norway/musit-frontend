/// <reference types="cypress"/>
import {
  locallySemiUniqueString,
  reactSelect_selectFirstOption,
  reactSelect_selectOptionWithText,
  startup,
  dropDownList_getFirstElement
} from '../common/utils';
import { defaultContext } from '../common/constants';
import { MainPage } from '../pages/mainPage';
import { PersonAddPage } from '../pages/person/personAddPage';

describe('View Person', function() {
  it('View Person', function() {
    startup();

    const lastName = 'Duck-' + locallySemiUniqueString();

    const page = new PersonAddPage(defaultContext);

    // Add initial person
    page.visit();

    page.titleField.type('Mr.');
    page.firstNameField.type('Donald');
    page.lastNameField.type(lastName);
    page.urlField.type('http://www.google.com');

    //reactSelect_selectOptionWithText('collectionsForPerson', 'KHM-Arkeologi');

    //  reactSelect_selectOptionWithText('legalEntityTypeDropDown', 'erson');
    dropDownList_getFirstElement('legalEntityTypeDropDown');
    reactSelect_selectFirstOption('collectionsForPerson');

    page.saveOrEditButton.click();
    page.saveOrEditButton.should('contain', 'Edit');

    page.titleField.should('have.value', 'Mr.');
    page.firstNameField.should('have.value', 'Donald');
    page.lastNameField.should('have.value', lastName);
    page.urlField.should('have.value', 'http://www.google.com');

    page.saveOrEditButton.click();
    cy.wait(500); //A small pause here seemed to be needed once, but perhaps not anymore?
    page.addSynonymButton.click();

    page.synonymTitleField.type('Mr.');
    page.synonymFirstNameField.type('Donald');
    page.synonymLastNameField.type('Duck');
    page.saveSynonymButton.click();

    page.addExternalIdButton.click();
    page.externalIdsField.type('http://disney.com/donald');

    reactSelect_selectOptionWithText('databases', 'Scopus');

    page.saveExternalIdButton.click();

    page.saveOrEditButton.click().then(pg => {
      cy.url().then(u => {
        window.localStorage.setItem('editUrl', `${u}`);
      });
    });
    cy.url().should('include', 'person/view/');

    // Get uuid for person from url to construct url for edit-endpoint, and visit edit-page
    cy.url().then(u => {
      const url = u.toString();
      const uuid = url.substr(url.lastIndexOf('/') + 1);
      // Visit edit page
      page.visit();
      cy.url().should('include', 'person/add');
      page.visitViewPage(uuid);
      cy.url().should('include', `person/view/${uuid}`);
    });
    cy.url().should('include', 'person/view/');

    page.firstNameField.should('be.disabled');

    // Data loading
    page.saveOrEditButton.should('contain', 'Edit');
    page.legalEntityType.should('be.disabled');
    page.titleField.should('be.disabled');
    page.firstNameField.should('be.disabled');
    page.lastNameField.should('be.disabled');
    page.urlField.should('be.disabled');

    page.legalEntityType.should('have.value', 'person');
    page.titleField.should('have.value', 'Mr.');
    page.firstNameField.should('have.value', 'Donald');
    page.urlField.should('have.value', 'http://www.google.com');

    const synonymHeaders = ['Tittel', 'Fornavn', 'Etternavn', 'Navn', ''];
    page.synonymsDataTableHeader.find('th').then($headers => {
      expect($headers).to.have.lengthOf(5);
      $headers.each((i, $header) => {
        expect($header).to.have.text(synonymHeaders[i]);
      });
    });

    const tableBody = page.synonymsDataTableBody.find('tr');
    tableBody.should('have.length.above', 0);

    const synonymsRowIsEmpty = page.synonymsDataTableBody
      .find('tr')
      .should('have.not.be.empty');

    const synonymsFirstRow = [' Mr.', 'Donald', 'Duck', 'Duck, Mr. Donald', ''];
    const synonymsFirstRowCol = page.synonymsDataTableBody.find('td').then($cell => {
      $cell.each((i, value) => {
        expect(value).to.have.text(synonymsFirstRow[i]);
      });
    });

    const externalIDHeaders = ['Database', 'UUID', '', ''];
    page.externalIDTableHeader.find('th').then($headers => {
      expect($headers).to.have.lengthOf(4);
      $headers.each((i, $header) => {
        expect($header).to.have.text(externalIDHeaders[i]);
      });
    });

    const externalIdRowIsEmpty = page.externalIDTableBody
      .find('tr')
      .should('have.not.be.empty');

    const externalIdsFirstRow = [' Scopus', 'http://disney.com/donald'];
    const externalIdsFirstRowCol = page.externalIDTableBody.find('td').then($cell => {
      $cell.each((i, value) => {
        expect(value).to.have.text(externalIdsFirstRow[i]);
      });
    });

    //page.saveOrEditButton.click();
    //page.visitEditPage();
  });
});
