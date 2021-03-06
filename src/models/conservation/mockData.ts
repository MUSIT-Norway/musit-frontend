export const conservationEventMockData = [
  {
    id: 1000,
    eventTypeId: 1,
    registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    registeredDate: '2015-09-12T10:47:41+00:00',
    events: [],
    status: 1,
    caseNumbers: [123]
  },
  {
    id: 1001,
    eventTypeId: 1,
    registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    registeredDate: '2016-09-18T09:32:20+00:00',
    note: 'gfgdgdf',
    events: [],
    status: 1,
    caseNumbers: [345, 'sn-123']
  }
];

export const conservationEventViewMockData = {
  id: 166,
  eventTypeId: 1,
  doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  doneDate: '2017-09-11T22:00:00+00:00',
  registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  registeredDate: '2017-09-20T13:39:51+00:00',
  updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  updatedDate: '2017-09-21T07:57:24+00:00',
  completedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  completedDate: '2017-09-19T22:00:00+00:00',
  note: 'Test note',
  affectedThings: [
    '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
    '788136fe-8038-47fc-9c59-9ddb010e0f74',
    'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
  ],
  caseNumber: 'test case number. 123',
  events: [
    {
      id: 167,
      eventTypeId: 10,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      affectedThing: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      partOf: 166,
      note: 'fdfds'
    },
    {
      id: 168,
      eventTypeId: 11,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      affectedThing: 'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
      partOf: 166,
      note: 'fdfds'
    },
    {
      id: 169,
      eventTypeId: 12,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      affectedThing: '788136fe-8038-47fc-9c59-9ddb010e0f74',
      partOf: 166,
      note: 'fdfds'
    },
    {
      id: 170,
      eventTypeId: 13,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      affectedThing: 'fa32417b-89ec-4d27-8f4b-27f3a2b03583',
      partOf: 166,
      note: 'fdfds'
    }
  ]
};

export const conservationEventTypeMockData = {
  conservationTypes: [
    {
      id: 1,
      noName: 'Konservering',
      enName: 'Conservation'
    },
    {
      id: 2,
      noName: 'Behandling',
      enName: 'Treatment'
    }
  ]
};

export const getJson = {
  id: 166,
  eventTypeId: 1, // conservation event

  // below two are auto created when when we do the post
  registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  registeredDate: '2017-09-20T13:39:51+00:00',

  // persons can be different based upon requirements
  doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  doneDate: '2017-09-11T22:00:00+00:00',
  completedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  completedDate: '2017-09-19T22:00:00+00:00',

  // attributes of main event
  note: 'Test note',
  caseNumber: 'test case number. 123',
  affectedThings: [
    '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
    '788136fe-8038-47fc-9c59-9ddb010e0f74',
    'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
  ],

  // below two are auto created when we do the put(will not come after post)
  updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  updatedDate: '2017-10-09T08:17:02+00:00',

  // sub events
  events: [
    {
      id: 167, // sub event id
      eventTypeId: 3, // technical description
      partOf: 166, // pointer to main event

      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      // below two are auto created when we do the put(will not come after post)
      updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      updatedDate: '2017-10-09T08:17:02+00:00',

      // can have sub set of main event affectedThings
      affectedThings: ['12080e3e-2ca2-41b1-9d4a-4d72e292dcd8'],
      // sub event specific attributes
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 168,
      eventTypeId: 3, // technical description number 2
      partOf: 166,

      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      // below two are auto created when we do the put(will not come after post)
      updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      updatedDate: '2017-10-09T08:17:02+00:00',

      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a'
      ],

      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 169,
      eventTypeId: 2,
      partOf: 166,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      // below two are auto created when we do the put(will not come after post)
      updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      updatedDate: '2017-10-09T08:17:02+00:00',

      affectedThings: ['788136fe-8038-47fc-9c59-9ddb010e0f74'],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 170,
      eventTypeId: 2,
      partOf: 166,
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-09-20T13:39:51+00:00',
      // below two are auto created when we do the put(will not come after post)
      updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      updatedDate: '2017-10-09T08:17:02+00:00',

      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
        '788136fe-8038-47fc-9c59-9ddb010e0f74',
        'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
      ],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    }
  ]
};

export const postJson = {
  eventTypeId: 1, // conservation event

  // persons can be different based upon requirements
  doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  doneDate: '2017-09-11T22:00:00+00:00',
  completedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  completedDate: '2017-09-19T22:00:00+00:00',

  // attributes of main event
  note: 'Test note',
  caseNumber: 'test case number. 123',
  affectedThings: [
    '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
    '788136fe-8038-47fc-9c59-9ddb010e0f74',
    'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
  ],

  // sub events
  events: [
    {
      eventTypeId: 3, // technical description

      // can have sub set of main event affectedThings
      affectedThings: ['12080e3e-2ca2-41b1-9d4a-4d72e292dcd8'],
      // sub event specific attributes
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      eventTypeId: 3, // technical description number 2
      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a'
      ],

      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      eventTypeId: 2,
      affectedThings: ['788136fe-8038-47fc-9c59-9ddb010e0f74'],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      eventTypeId: 2,
      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
        '788136fe-8038-47fc-9c59-9ddb010e0f74',
        'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
      ],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    }
  ]
};

export const putJson = {
  id: 166,
  eventTypeId: 1, // conservation event

  // persons can be different based upon requirements
  doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  doneDate: '2017-09-11T22:00:00+00:00',
  completedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  completedDate: '2017-09-19T22:00:00+00:00',

  // attributes of main event
  note: 'Test note',
  caseNumber: 'test case number. 123',
  affectedThings: [
    '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
    '788136fe-8038-47fc-9c59-9ddb010e0f74',
    'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
  ],

  // sub events
  events: [
    {
      id: 167, // sub event id
      eventTypeId: 3, // technical description
      partOf: 166, // pointer to main event

      // can have sub set of main event affectedThings
      affectedThings: ['12080e3e-2ca2-41b1-9d4a-4d72e292dcd8'],
      // sub event specific attributes
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 168,
      eventTypeId: 3, // technical description number 2
      partOf: 166,

      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a'
      ],

      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 169,
      eventTypeId: 2,
      partOf: 166,

      affectedThings: ['788136fe-8038-47fc-9c59-9ddb010e0f74'],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    },
    {
      id: 170,
      eventTypeId: 2,
      partOf: 166,

      affectedThings: [
        '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
        '788136fe-8038-47fc-9c59-9ddb010e0f74',
        'fa32417b-89ec-4d27-8f4b-27f3a2b03583'
      ],
      note: 'fdfds',
      doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      doneDate: '2017-09-11T22:00:00+00:00'
    }
  ]
};
