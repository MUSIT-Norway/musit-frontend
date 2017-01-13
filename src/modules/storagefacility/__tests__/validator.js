import validateForm from '../nodeValidator';

describe('Test root level check for Organisation', () => {
  const rootNode = {
    id: 1,
    name: 'root-node',
    path: ',1,',
    pathNames:[
      {
        nodeId: 1,
        name: 'root-node'
      }
    ],
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    updatedBy: 123,
    updatedDate: '2016-10-24T16:13:24+00:00',
    type: 'Root'
  };

  const unit = {
    name: 'Test name',
    isPartOf: 1,
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    type: 'Room'
  };

  const propTypes = {
    unit: unit,
    rootNode: rootNode
  };

  it('Check Organisation check fail', () => {
    expect(validateForm(propTypes).type.includes('Bare typen organisasjon er tillatt på dette nivå.')).toBe(true);
  });

  const propTypesPass = JSON.parse(JSON.stringify(propTypes));
  propTypesPass['unit']['type'] = 'Organisation';

  it('Test Organisation check pass:Error list is empty for Organisation', () => {
    expect(validateForm(propTypesPass).type).toBe(undefined);
  });
});


describe('Test one level below the root level: check for building.', () => {
  const rootNode = {
    id: 2,
    name: 'Utviklingsmuseet',
    isPartOf:1,
    path: ',1,2,',
    pathNames:[
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      }
    ],
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    updatedBy: 123,
    updatedDate: '2016-10-24T16:13:24+00:00',
    type: 'Organisation'
  };

  const unit = {
    name: 'Test name',
    isPartOf:1,
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    type: 'Room'
  };

  const propTypes = {
    unit: unit,
    rootNode: rootNode
  };

  it('Test building check fail', () => {
    expect(validateForm(propTypes).type.includes('Bare typen bygg er tillatt på dette nivå.')).toBe(true);
  });

  const propTypesPass = JSON.parse(JSON.stringify(propTypes));
  propTypesPass['unit']['type'] = 'Building';

  it('Test Building check pass:Error list is empty for Building', () => {
    expect(validateForm(propTypesPass).type).toBe(undefined);
  });

});

describe('Test three level below the root level: Organisation should allow anything.', () => {
  const rootNode = {
    id: 5,
    name: 'Utviklingsmuseet',
    isPartOf:1,
    path: ',1,2,3,5',
    pathNames:[
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      },
      {
        nodeId: 3,
        name: 'Utviklingsmuseet'
      },
      {
        nodeId: 5,
        name: 'Utviklingsmuseet'
      }
    ],
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    updatedBy: 123,
    updatedDate: '2016-10-24T16:13:24+00:00',
    type: 'Organisation'
  };

  const unit = {
    name: 'Test name',
    isPartOf:1,
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    type: 'N/A' // specified in tests below
  };

  const propTypes = {
    unit: unit,
    rootNode: rootNode
  };

  it('Test that StorageUnit is allowed', () => {
    expect(validateForm({ ...propTypes, type: 'StorageUnit' }).type).toBe(undefined);
  });

  it('Test that Room is allowed', () => {
    expect(validateForm({ ...propTypes, type: 'Room' }).type).toBe(undefined);
  });

  it('Test that Building is allowed', () => {
    expect(validateForm({ ...propTypes, type: 'Building' }).type).toBe(undefined);
  });

  it('Test that Organisation is allowed', () => {
    expect(validateForm({ ...propTypes, type: 'Organisation' }).type).toBe(undefined);
  });

  const propTypesPass = JSON.parse(JSON.stringify(propTypes));
  propTypesPass['unit']['type'] = 'Building';

  it('Test Building check pass:Error list is empty for Building', () => {
    expect(validateForm(propTypesPass).type).toBe(undefined);
  });

});

