const initialState = {
  data: {
    datePerformed: '2016-05-19T16:00:00.000Z',
    performedBy: 'Test user first',
    dateRegistered: '2013-12-10T16:00:00.000Z',
    registeredBy: 'Test user second',

    control: {
      temperatureControl: {
        ok: true
      },
      relativeHumidity: {
        ok: false
      },
      lightConditionControl: {
        ok: false
      },
      pestControl: {
        ok: false
      },
      alcoholControl: {
        ok: true
      }
    }
  }
};
/*
const initialState2 = {
  data: {
    datePerformed: '2016-05-19T16:00:00.000Z',
    performedBy: 'Test user first',
    dateRegistered: '2013-12-10T16:00:00.000Z',
    registeredBy: 'Test user second',
    id: 9,
    links: [
      {
        rel: 'self',
        href: 'http://localhost:7070/v1/9'
      }
    ],
    eventType: 'Control',
    note: 'tekst',
    'subEvents-parts': [
      {
        id: 10,
        links: [
          {
            rel: 'self',
            href: 'http://localhost:7070/v1/10'
          }
        ],
        eventType: 'ControlInertluft',
        ok: true
      },
      {
        id: 11,
        links: [
          {
            rel: 'self',
            href: 'http://localhost:7070/v1/11'
          }
        ],
        eventType: 'ControlTemperature',
        ok: false,
        'subEvents-motivates': [
          {
            id: 12,
            links: [
              {
                rel: 'self',
                href: 'http://localhost:7070/v1/12'
              }
            ],
            eventType: 'ObservationTemperature',
            from: 20,
            to: 50
          }
        ]
      }
    ]
  }
};
*/
const controlDetailsReducer = (state = initialState) => {
  return state;
}

export default controlDetailsReducer
