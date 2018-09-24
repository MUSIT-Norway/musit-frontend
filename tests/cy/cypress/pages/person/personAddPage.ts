import { Context, constructUrl } from '../../common/utils';

export class PersonAddPage {
  constructor(private readonly context: Context) {}

  get legalEntityType(){
    return cy.get('#legalEntityTypeDropDown');
  }
  
  get titleField() {
    return cy.get('#title');
  }

  get firstNameField() {
    return cy.get('#firstName');
  }

  get lastNameField() {
    return cy.get('#lastName');
  }
  
  get urlField(){
    return cy.get('#url');
  }

  get saveOrEditButton() {
    return cy.get('#saveOrEdit');
  }

  get synonymTitleField() {
    return cy.get('#synonymTitle');
  }

  get synonymFirstNameField() {
    return cy.get('#synonymFirstName');
  }

  get synonymLastNameField() {
    return cy.get('#synonymLastName');
  }

  get addSynonymButton() {
    return cy.get('#addSynonym');
  }
  get saveSynonymButton() {
    return cy.get('#saveSynonym');
  }

  get synonymsDataTableHeader() {
    return cy.get('#synynomDataTableHeader');
  }
  get synonymsDataTableBody() {
    return cy.get('#synonymsTableBody');
  }

  get externalIdsField() {
    return cy.get('#externalIds');
  }

  get externalIdsDBField() {
    return cy.get('#databases');
  }

  get addExternalIdButton() {
    return cy.get('#addExternalId');
  }
  get saveExternalIdButton() {
    return cy.get('#saveExternalId');
  }

  get externalIDTableHeader() {
    return cy.get('#externalIDTableHeader');
  }
  get externalIDTableBody() {
    return cy.get('#externalIDTableBody');
  }

  visit() {
    return cy.visit(constructUrl(this.context, 'person/add'));
  }

  visitViewPage() {
    return cy.visit(constructUrl(this.context, 'person/view/3564a192-6c56-46b8-baa3-a143e75c5c27'));
  }

  visitEditPage() {
    return cy.visit(constructUrl(this.context, 'person/edit/3564a192-6c56-46b8-baa3-a143e75c5c27'));
  }
}
