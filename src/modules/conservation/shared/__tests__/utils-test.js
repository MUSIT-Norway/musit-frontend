import { getFormEvents, getFids } from '../utils';

const formData = {
  id: {
    name: 'id',
    defaultValue: 328,
    value: '328',
    rawValue: '328',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  eventTypeId: {
    name: 'eventTypeId',
    defaultValue: 1,
    value: 1,
    rawValue: '1',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  actorsAndRoles: {
    name: 'actorsAndRoles',
    defaultValue: [],
    value: [],
    rawValue: [],
    mapper: {},
    validator: {},
    status: { valid: true, error: null }
  },
  registeredBy: {
    name: 'registeredBy',
    defaultValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    value: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    rawValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  registeredByName: {
    name: 'registeredByName',
    defaultValue: 'Rituvesh Kumar',
    value: 'Rituvesh Kumar',
    rawValue: 'Rituvesh Kumar',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  registeredDate: {
    name: 'registeredDate',
    defaultValue: '2017-12-22T10:42:08+00:00',
    value: '2017-12-22T10:42:08+00:00',
    rawValue: '2017-12-22T10:42:08+00:00',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  note: {
    name: 'note',
    defaultValue: 'dfsdfsdfsd',
    value: 'dfsdfsdfsd',
    rawValue: 'dfsdfsdfsd',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  caseNumber: {
    name: 'caseNumber',
    defaultValue: null,
    value: null,
    rawValue: null,
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  affectedThings: {
    name: 'affectedThings',
    defaultValue: [
      {
        objectData: {
          id: 21,
          uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
          museumId: 99,
          museumNo: 'MusK34',
          subNo: 'a',
          term: 'Kniv',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 21,
        uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
        museumId: 99,
        museumNo: 'MusK34',
        subNo: 'a',
        term: 'Kniv',
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      }
    ],
    value: [
      {
        objectData: {
          id: 21,
          uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
          museumId: 99,
          museumNo: 'MusK34',
          subNo: 'a',
          term: 'Kniv',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 21,
        uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
        museumId: 99,
        museumNo: 'MusK34',
        subNo: 'a',
        term: 'Kniv',
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      }
    ],
    rawValue: [
      {
        objectData: {
          id: 21,
          uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
          museumId: 99,
          museumNo: 'MusK34',
          subNo: 'a',
          term: 'Kniv',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 21,
        uuid: '5cdb4e07-8e18-4652-9501-3142991e0baa',
        museumId: 99,
        museumNo: 'MusK34',
        subNo: 'a',
        term: 'Kniv',
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      }
    ],
    mapper: {},
    validator: {},
    status: { valid: true, error: null }
  },
  objects: {
    name: 'objects',
    defaultValue: [],
    value: [],
    rawValue: [],
    mapper: {},
    validator: {},
    status: { valid: true, error: null }
  },
  updatedBy: {
    name: 'updatedBy',
    defaultValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    value: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    rawValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  updatedByName: {
    name: 'updatedByName',
    defaultValue: 'Rituvesh Kumar',
    value: 'Rituvesh Kumar',
    rawValue: 'Rituvesh Kumar',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  updatedDate: {
    name: 'updatedDate',
    defaultValue: '2017-12-22T10:49:37+00:00',
    value: '2017-12-22T10:49:37+00:00',
    rawValue: '2017-12-22T10:49:37+00:00',
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  subEventTypes: {
    name: 'subEventTypes',
    defaultValue: '',
    value: null,
    rawValue: null,
    mapper: {},
    validator: { rawValidator: null },
    status: { valid: true, error: null }
  },
  events: {
    name: 'events',
    defaultValue: [
      {
        id: 329,
        eventTypeId: 2,
        registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        registeredDate: '2017-12-22T10:42:08+00:00',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-12-22T10:49:37+00:00',
        partOf: 328,
        note: '',
        actorsAndRoles: [],
        affectedThings: ['5cdb4e07-8e18-4652-9501-3142991e0baa'],
        keywords: [],
        materials: [],
        documents: ['acd73bb7-ea74-460b-a645-c6608a336aeb'],
        updatedByName: 'Rituvesh Kumar',
        registeredByName: 'Rituvesh Kumar',
        files: [
          {
            id: 'c699bd6c-e704-11e7-8599-c31280f7467b',
            fid: 'acd73bb7-ea74-460b-a645-c6608a336aeb',
            title: 'Screenshot from 2017-05-31 11-29-44 (13th copy).png',
            size: '304576',
            fileType: 'image/png',
            owner: { ownerId: '99', ownerType: 'org' },
            path: '/root/Modules/Conservation/329',
            version: 1,
            published: false,
            createdStamp: {
              date: '2017-12-22T10:42:15.562+00:00',
              by: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
            },
            documentDetails: { number: 1 },
            type: 'archive_document'
          }
        ]
      }
    ],
    value: [
      {
        id: 329,
        eventTypeId: 2,
        registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        registeredDate: '2017-12-22T10:42:08+00:00',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-12-22T10:49:37+00:00',
        partOf: 328,
        note: '',
        actorsAndRoles: [],
        affectedThings: ['5cdb4e07-8e18-4652-9501-3142991e0baa'],
        keywords: [],
        materials: [],
        documents: ['acd73bb7-ea74-460b-a645-c6608a336aeb'],
        updatedByName: 'Rituvesh Kumar',
        registeredByName: 'Rituvesh Kumar',
        files: [
          {
            id: 'c699bd6c-e704-11e7-8599-c31280f7467b',
            fid: 'acd73bb7-ea74-460b-a645-c6608a336aeb',
            title: 'Screenshot from 2017-05-31 11-29-44 (13th copy).png',
            size: '304576',
            fileType: 'image/png',
            owner: { ownerId: '99', ownerType: 'org' },
            path: '/root/Modules/Conservation/329',
            version: 1,
            published: false,
            createdStamp: {
              date: '2017-12-22T10:42:15.562+00:00',
              by: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
            },
            documentDetails: { number: 1 },
            type: 'archive_document'
          }
        ],
        expanded: true
      }
    ],
    rawValue: [
      {
        id: 329,
        eventTypeId: 2,
        registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        registeredDate: '2017-12-22T10:42:08+00:00',
        updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        updatedDate: '2017-12-22T10:49:37+00:00',
        partOf: 328,
        note: '',
        actorsAndRoles: [],
        affectedThings: ['5cdb4e07-8e18-4652-9501-3142991e0baa'],
        keywords: [],
        materials: [],
        documents: ['acd73bb7-ea74-460b-a645-c6608a336aeb'],
        updatedByName: 'Rituvesh Kumar',
        registeredByName: 'Rituvesh Kumar',
        files: [
          {
            id: 'c699bd6c-e704-11e7-8599-c31280f7467b',
            fid: 'acd73bb7-ea74-460b-a645-c6608a336aeb',
            title: 'Screenshot from 2017-05-31 11-29-44 (13th copy).png',
            size: '304576',
            fileType: 'image/png',
            owner: { ownerId: '99', ownerType: 'org' },
            path: '/root/Modules/Conservation/329',
            version: 1,
            published: false,
            createdStamp: {
              date: '2017-12-22T10:42:15.562+00:00',
              by: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
            },
            documentDetails: { number: 1 },
            type: 'archive_document'
          }
        ],
        expanded: true
      }
    ],
    mapper: {},
    validator: {},
    status: { valid: true, error: null }
  }
};

const expectedFormData = [
  {
    id: 329,
    eventTypeId: 2,
    registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    registeredDate: '2017-12-22T10:42:08+00:00',
    updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    updatedDate: '2017-12-22T10:49:37+00:00',
    partOf: 328,
    note: '',
    actorsAndRoles: [],
    affectedThings: ['5cdb4e07-8e18-4652-9501-3142991e0baa'],
    keywords: [],
    materials: [],
    documents: ['acd73bb7-ea74-460b-a645-c6608a336aeb'],
    updatedByName: 'Rituvesh Kumar',
    registeredByName: 'Rituvesh Kumar',
    files: [
      {
        id: 'c699bd6c-e704-11e7-8599-c31280f7467b',
        fid: 'acd73bb7-ea74-460b-a645-c6608a336aeb',
        title: 'Screenshot from 2017-05-31 11-29-44 (13th copy).png',
        size: '304576',
        fileType: 'image/png',
        owner: { ownerId: '99', ownerType: 'org' },
        path: '/root/Modules/Conservation/329',
        version: 1,
        published: false,
        createdStamp: {
          date: '2017-12-22T10:42:15.562+00:00',
          by: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
        },
        documentDetails: { number: 1 },
        type: 'archive_document'
      }
    ],
    expanded: true
  }
];
describe('getFormEvents', () => {
  it('getFormEvents complete data', () => {
    expect(JSON.stringify(getFormEvents(formData))).toBe(
      JSON.stringify(expectedFormData)
    );
  });

  it('getFormEvents no data', () => {
    expect(JSON.stringify(getFormEvents({}))).toBe(JSON.stringify([]));
  });

  const onlyForm = {};
  it('getFormEvents onlyForm', () => {
    expect(JSON.stringify(getFormEvents(onlyForm))).toBe(JSON.stringify([]));
  });

  const formWithBlankEvents = {
    evetns: {}
  };
  it('getFormEvents formWithBlankEvents', () => {
    expect(JSON.stringify(getFormEvents(formWithBlankEvents))).toBe(JSON.stringify([]));
  });

  const formWithEventsBlankRawValue = {
    evetns: { rawValue: [] }
  };
  it('getFormEvents formWithEventsBlankRawValue', () => {
    expect(JSON.stringify(getFormEvents(formWithEventsBlankRawValue))).toBe(
      JSON.stringify([])
    );
  });
});

const files = [
  {
    id: 'c699bd6c-e704-11e7-8599-c31280f7467b',
    fid: 'acd73bb7-ea74-460b-a645-c6608a336aeb',
    title: 'Screenshot from 2017-05-31 11-29-44 (13th copy).png',
    size: '304576',
    fileType: 'image/png',
    owner: { ownerId: '99', ownerType: 'org' },
    path: '/root/Modules/Conservation/329',
    version: 1,
    published: false,
    createdStamp: {
      date: '2017-12-22T10:42:15.562+00:00',
      by: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
    },
    documentDetails: { number: 1 },
    type: 'archive_document'
  },
  {
    error: 'some error'
  },
  {
    fid: null
  }
];

describe('getFids', () => {
  it('getFids complete data', () => {
    expect(JSON.stringify(getFids(files))).toBe(
      JSON.stringify(['acd73bb7-ea74-460b-a645-c6608a336aeb'])
    );
  });

  it('getFids no data', () => {
    expect(JSON.stringify(getFids())).toBe(JSON.stringify([]));
  });
});
