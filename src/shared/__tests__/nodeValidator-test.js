import {
  checkNodeBranchAndType,
  checkNodeBranch,
  checkNodeType,
  getPathLength
} from '../nodeValidator';

describe('Test node validation', () => {
  const from_node_11 = {
    marked: true,
    value: {
      id: 11,
      name: 'C1',
      isPartOf: 18,
      groupRead: 'foo',
      path: ',1,2,18,11,',
      type: 'Building',
      updatedBy: 666,
      updatedDate: '2016-11-15T13:32:22+00:00'
    },
    path: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      },
      {
        id: 2,
        name: 'Utviklingsmuseet',
        url: '/magasin/2'
      },
      {
        id: 18,
        name: 'P1',
        url: '/magasin/18'
      }
    ]
  };

  const from_node_11_from_Node_Grid = {
    id: 11,
    name: 'C1',
    isPartOf: 18,
    groupRead: 'foo',
    path: ',1,2,18,11,',
    type: 'Building',
    updatedBy: 666,
    updatedDate: '2016-11-15T13:32:22+00:00'
  };

  const from_node_14 = {
    marked: true,
    value: {
      id: 14,
      name: 'c3',
      isPartOf: 18,
      groupRead: 'foo',
      path: ',1,2,18,14,',
      type: 'Organisation',
      updatedBy: 666,
      updatedDate: '2016-11-15T13:33:37+00:00'
    },
    path: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      },
      {
        id: 2,
        name: 'Utviklingsmuseet',
        url: '/magasin/2'
      },
      {
        id: 18,
        name: 'P1',
        url: '/magasin/18'
      }
    ]
  };

  const from_node_21 = {
    marked: true,
    value: {
      id: 21,
      name: 'room 1 ',
      isPartOf: 11,
      groupRead: 'foo',
      path: ',1,2,18,11,21,',
      type: 'Room',
      updatedBy: 123,
      updatedDate: '2016-11-15T15:04:30+00:00'
    },
    path: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      },
      {
        id: 2,
        name: 'Utviklingsmuseet',
        url: '/magasin/2'
      },
      {
        id: 18,
        name: 'P1',
        url: '/magasin/18'
      },
      {
        id: 11,
        name: 'C1',
        url: '/magasin/11'
      }
    ]
  };

  const to_node_21 = {
    id: 21,
    name: 'room 1 ',
    isPartOf: 11,
    groupRead: 'foo',
    path: ',1,2,18,11,21,',
    pathNames: [
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      },
      {
        nodeId: 18,
        name: 'P1'
      },
      {
        nodeId: 11,
        name: 'C1'
      },
      {
        nodeId: 21,
        name: 'room 1 '
      }
    ],
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    updatedBy: 123,
    updatedDate: '2016-11-15T15:04:30+00:00',
    type: 'Room',
    breadcrumb: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      },
      {
        id: 2,
        name: 'Utviklingsmuseet',
        url: '/magasin/2'
      },
      {
        id: 18,
        name: 'P1',
        url: '/magasin/18'
      },
      {
        id: 11,
        name: 'C1',
        url: '/magasin/11'
      },
      {
        id: 21,
        name: 'room 1 ',
        url: '/magasin/21'
      }
    ]
  };

  const to_node_2 = {
    id: 2,
    name: 'Utviklingsmuseet',
    isPartOf: 1,
    path: ',1,2,',
    pathNames: [
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      }
    ],
    updatedBy: 123,
    updatedDate: '2016-01-01T00:00:00+00:00',
    type: 'Organisation',
    breadcrumb: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      },
      {
        id: 2,
        name: 'Utviklingsmuseet',
        url: '/magasin/2'
      }
    ]
  };

  const to_node_1 = {
    id: 1,
    name: 'root-node',
    path: ',1,',
    type: 'Root',
    breadcrumb: [
      {
        id: 1,
        name: 'root-node',
        url: '/magasin/1'
      }
    ]
  };

  it('checkNodeBranchAndType fail', () => {
    const output = checkNodeBranchAndType(from_node_11, to_node_21);
    expect(output.includes('En node kan ikke flyttes inn i seg selv')).toBe(true);
  });

  it('checkNodeBranchAndType pass', () => {
    const output = checkNodeBranchAndType(from_node_14, to_node_21);
    expect(output).toBe(undefined);
  });

  it('checkNodeBranchAndType building pass', () => {
    const output = checkNodeBranchAndType(from_node_11, to_node_2);
    expect(output).toBe(undefined);
  });

  it('checkNodeBranchAndType building pass from node grid json', () => {
    const output = checkNodeBranchAndType(from_node_11_from_Node_Grid, to_node_2);
    expect(output).toBe(undefined);
  });

  it('checkNodeBranch fail', () => {
    const output = checkNodeBranch(from_node_11, to_node_21);
    expect(output.includes('En node kan ikke flyttes inn i seg selv')).toBe(true);
  });

  it('checkNodeBranch pass', () => {
    const output = checkNodeBranch(from_node_14, to_node_21);
    expect(output).toBe(undefined);
  });

  it('checkNodeBranch pass 2', () => {
    const output = checkNodeBranch(from_node_14, to_node_1);
    expect(output).toBe(undefined);
  });

  it('checkNodeType fail', () => {
    const output = checkNodeType(from_node_21, to_node_2);
    expect(
      output.includes('Kun noder av type Bygg kan flyttes til en node type Organisasjon.')
    ).toBe(true);
  });

  it('checkNodeType pass', () => {
    const output = checkNodeType(from_node_11, to_node_2);
    expect(output).toBe(undefined);
  });

  it('checkNodeType fail for root', () => {
    const output = checkNodeType(from_node_21, to_node_1);
    expect(
      output.includes('Kun noder av type Organisasjon kan flyttes til en rotnode.')
    ).toBe(true);
  });

  it('checkNodeType fail for root 2', () => {
    const output = checkNodeType(from_node_11, to_node_1);
    expect(output).toBe('Kun noder av type Organisasjon kan flyttes til en rotnode.');
  });

  it('checkNodeType fail for root 3', () => {
    const output = checkNodeType(from_node_21, to_node_1);
    expect(output).toBe('Kun noder av type Organisasjon kan flyttes til en rotnode.');
  });

  it('checkNodeType pass for root', () => {
    const output = checkNodeType(from_node_14, to_node_1);
    expect(output).toBe(undefined);
  });

  it('getPathLength ', () => {
    const output = getPathLength(to_node_2);
    expect(output).toBe(2);
  });
});
