import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import UserAccount from '../UserAccount';
import { MenuItem } from 'react-bootstrap';
import startWith from 'lodash/startsWith';

describe('UserAccount', () => {
  it('should not render duplicate menu elements for museum', () => {
    const handleLogout = sinon.spy();
    const handleLanguage = sinon.spy();
    const handleMuseumId = sinon.spy();
    const handleCollectionId = sinon.spy();

    const Comp = shallow(
      <UserAccount
        token="dummy-token"
        actor={actor}
        groups={userGroupsWithDuplicateMuseums}
        handleLogout={handleLogout}
        handleLanguage={handleLanguage}
        handleMuseumId={handleMuseumId}
        handleCollectionId={handleCollectionId}
      />
    );

    const museumMenuElements = Comp.find(MenuItem).filterWhere(n =>
      startWith(n.key(), 'museum')
    );

    expect(museumMenuElements.length).toBe(1);
  });

  it('should render multiple museum menu element', () => {
    const handleLogout = sinon.spy();
    const handleLanguage = sinon.spy();
    const handleMuseumId = sinon.spy();
    const handleCollectionId = sinon.spy();

    const Comp = shallow(
      <UserAccount
        token="dummy-token"
        actor={actor}
        groups={userGroupsWithMultipleMuseums}
        handleLogout={handleLogout}
        handleLanguage={handleLanguage}
        handleMuseumId={handleMuseumId}
        handleCollectionId={handleCollectionId}
      />
    );

    const museumMenuElements = Comp.find(MenuItem).filterWhere(n =>
      startWith(n.key(), 'museum')
    );

    expect(museumMenuElements.length).toBe(2);
  });
});

const actor = {
  fn: 'Ola Nordmann',
  dataportenId: '8111556b-fb6a-4a61-a3ee-e1d40b4579ca'
};

const userGroupsWithMultipleMuseums = [
  {
    id: '1a988329-fb84-4ef9-8f68-869e1a22b511',
    name: 'VmCmAdmin',
    module: 2,
    museumName: 'VM',
    permission: 30,
    museumId: 5,
    description: 'Admin access to collection management for VM',
    collections: [
      {
        uuid: '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
        name: 'Sopp',
        oldSchemaNames: [6]
      }
    ]
  },
  {
    id: 'cd9ea5bf-7972-45c2-a0fd-b7e75fc2e5db',
    name: 'VmSfAdmin',
    module: 1,
    museumName: 'VM',
    permission: 30,
    museumId: 5,
    description: 'Admin access to storage facility for VM',
    collections: [
      {
        uuid: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
        name: 'Numismatikk',
        oldSchemaNames: [3]
      }
    ]
  },
  {
    id: 'cd9ea5bf-7972-45c2-a0fd-b7e75fcaaaa',
    name: 'VmSfAdmin',
    module: 1,
    museumName: 'Test',
    permission: 30,
    museumId: 99,
    description: 'Admin access to storage facility for VM',
    collections: [
      {
        uuid: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
        name: 'Numismatikk',
        oldSchemaNames: [3]
      }
    ]
  }
];

const userGroupsWithDuplicateMuseums = [
  {
    id: '1a988329-fb84-4ef9-8f68-869e1a22b511',
    name: 'VmCmAdmin',
    module: 2,
    museumName: 'VM',
    permission: 30,
    museumId: 5,
    description: 'Admin access to collection management for VM',
    collections: [
      {
        uuid: '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
        name: 'Sopp',
        oldSchemaNames: [6]
      },
      {
        uuid: 'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
        name: 'Marine evertebrater',
        oldSchemaNames: [10]
      },
      {
        uuid: '7352794d-4973-447b-b84e-2635cafe910a',
        name: 'Karplanter',
        oldSchemaNames: [8]
      },
      {
        uuid: '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
        name: 'Alger',
        oldSchemaNames: [7]
      },
      {
        uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
        name: 'Arkeologi',
        oldSchemaNames: [1]
      },
      {
        uuid: '88b35138-24b5-4e62-bae4-de80fae7df82',
        name: 'Etnografi',
        oldSchemaNames: [2]
      },
      {
        uuid: 'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
        name: 'Mose',
        oldSchemaNames: [5]
      },
      {
        uuid: 'fcb4c598-8b05-4095-ac00-ce66247be38a',
        name: 'Lav',
        oldSchemaNames: [4]
      },
      {
        uuid: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
        name: 'Numismatikk',
        oldSchemaNames: [3]
      },
      {
        uuid: 'ba3d4d30-810b-4c07-81b3-37751f2196f0',
        name: 'Entomologi',
        oldSchemaNames: [9]
      }
    ]
  },
  {
    id: 'cd9ea5bf-7972-45c2-a0fd-b7e75fc2e5db',
    name: 'VmSfAdmin',
    module: 1,
    museumName: 'VM',
    permission: 30,
    museumId: 5,
    description: 'Admin access to storage facility for VM',
    collections: [
      {
        uuid: '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
        name: 'Numismatikk',
        oldSchemaNames: [3]
      },
      {
        uuid: '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
        name: 'Alger',
        oldSchemaNames: [7]
      },
      {
        uuid: 'fcb4c598-8b05-4095-ac00-ce66247be38a',
        name: 'Lav',
        oldSchemaNames: [4]
      },
      {
        uuid: '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
        name: 'Sopp',
        oldSchemaNames: [6]
      },
      {
        uuid: '7352794d-4973-447b-b84e-2635cafe910a',
        name: 'Karplanter',
        oldSchemaNames: [8]
      },
      {
        uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
        name: 'Arkeologi',
        oldSchemaNames: [1]
      },
      {
        uuid: '88b35138-24b5-4e62-bae4-de80fae7df82',
        name: 'Etnografi',
        oldSchemaNames: [2]
      },
      {
        uuid: 'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
        name: 'Marine evertebrater',
        oldSchemaNames: [10]
      },
      {
        uuid: 'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
        name: 'Mose',
        oldSchemaNames: [5]
      },
      {
        uuid: 'ba3d4d30-810b-4c07-81b3-37751f2196f0',
        name: 'Entomologi',
        oldSchemaNames: [9]
      }
    ]
  }
];
