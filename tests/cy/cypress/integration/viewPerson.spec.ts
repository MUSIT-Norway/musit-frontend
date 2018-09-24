/// <reference types="cypress"/>
import {  
  locallySemiUniqueString,
  reactSelect_selectFirstOption,
  reactSelect_selectOptionWithText,
  startup
} from '../common/utils';
import { defaultContext } from '../common/constants';
import { MainPage } from '../pages/mainPage';
import { PersonAddPage } from '../pages/person/personAddPage';

describe('View Person', function() {
  it('View Person', function() {
    startup();

    const lastName = 'Duck-';

    const page = new PersonAddPage(defaultContext);
    page.visitViewPage();

    // Data loading 
    page.saveOrEditButton.should('contain', 'Edit');
    page.legalEntityType.should('be.disabled');
    page.titleField.should('be.disabled');
    page.firstNameField.should('be.disabled');
    page.lastNameField.should('be.disabled');
    page.urlField.should('be.disabled');
   
    page.legalEntityType.should('have.value', 'person');
    page.titleField.should('have.value', 'Mr. '); 
    page.firstNameField.should('have.value', 'Donald');
    page.urlField.should('have.value', 'http://www.google.com' );

    const synonymHeaders = ['Tittel', 'Fornavn', 'Etternavn', 'Navn',''];
    page.synonymsDataTableHeader.find('th')
    .then( ($headers)=> {
        expect($headers).to.have.lengthOf(5);
        $headers.each((i, $header)=> {
            expect($header).to.have.text(synonymHeaders[i])
        })
    })

    const tableBody = page.synonymsDataTableBody.find('tr');
    tableBody.should('have.length.above', 0);

    const synonymsRowIsEmpty = page.synonymsDataTableBody
                .find('tr')
                .should('have.not.be.empty');

    const synonymsFirstRow = [' Mr. ', 'Donald', 'Duck', 'Duck, Mr.  Donald',''];           
    const synonymsFirstRowCol = page.synonymsDataTableBody
                .find('td')
                .then( ($cell)=> {
                    $cell.each( (i, value)=> {
                        expect(value).to.have.text(synonymsFirstRow[i]);
                    }) 
                }); 
    
    const externalIDHeaders = ['Database', 'UUID','',''];
    page.externalIDTableHeader.find('th')
    .then( ($headers)=> {
        expect($headers).to.have.lengthOf(4);
        $headers.each((i, $header)=> {
            expect($header).to.have.text(externalIDHeaders[i])
        })
    });
    
    
    const externalIdRowIsEmpty = page.externalIDTableBody
    .find('tr')
    .should('have.not.be.empty');

    const externalIdsFirstRow = [' Scopus', 'http://disney.com/donald'];           
    const externalIdsFirstRowCol = page.externalIDTableBody
    .find('td')
    .then( ($cell)=> {
        $cell.each( (i, value)=> {
            expect(value).to.have.text(externalIdsFirstRow[i]);
        }) 
    }); 


    //page.saveOrEditButton.click();
    //page.visitEditPage();

  });
});
