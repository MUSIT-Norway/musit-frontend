import { Context, constructUrl } from '../../common/utils';

export class PersonAddPage {
  constructor(private readonly context: Context) {}
  get titleField() {
    return cy.get('#title');
  }

  get firstNameField() {
    return cy.get('#firstName');
  }

  get lastNameField() {
    return cy.get('#lastName');
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

  get externalIdsField() {
    return cy.get('#externalIds');
  }

  get addExternalIdButton() {
    return cy.get('#addExternalId');
  }
  get saveExternalIdButton() {
    return cy.get('#saveExternalId');
  }

  visit() {
    return cy.visit(constructUrl(this.context, 'person/add'));
  }
}
