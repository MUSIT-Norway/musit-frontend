import assert from 'assert'
import { isDateBiggerThanToday, parseISODateNonStrict, parseISODateStrict } from '../'
import { sortObject } from '../sort'
import moment from 'moment'

describe('parseISODateNonStrict', () => {
  it('should accept full iso timestamp', () => {
    const date = '2016-09-07T22:56:00.000Z';
    const parsed = parseISODateNonStrict(date);
    expect(parsed).toMatchSnapshot()
  });

  it('should accept standard simple ISO date format', () => {
    const date = '2016-12-23';
    const parsed = parseISODateNonStrict(date);
    assert(parsed.isValid() === true)
  })
});

describe('parseISODateStrict', () => {
  it('should reject full iso timestamp', () => {
    const date = '2016-09-07T22:56:00+00:00';
    const parsed = parseISODateStrict(date);
    assert(parsed.isValid() === false)
  });

  it('should accept standard simple ISO date format', () => {
    const date = '2016-09-07';
    const parsed = parseISODateStrict(date);
    assert(parsed.isValid() === true)
  })
});

describe('isDateBiggerThanToday', () => {
  it('Check Today', () => {
    const newDate = moment();
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check one day plus Today', () => {
    const newDate = moment().add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true)
  });
  it('Check one month plus Today', () => {
    const newDate = moment().add(1, 'M');
    assert(isDateBiggerThanToday(newDate) === true)
  });
  it('Check one year plus Today', () => {
    const newDate = moment().add(1, 'y');
    assert(isDateBiggerThanToday(newDate) === true)
  });
  it('Check one day subtract from Today', () => {
    const newDate = moment().subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check one month subtract from Today', () => {
    const newDate = moment().subtract(2, 'M');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check one year subtract from Today', () => {
    const newDate = moment().subtract(1, 'y');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check Today minus one month three days', () => {
    let newDate = moment().subtract(3, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check Today minus one month 15 days', () => {
    let newDate = moment().subtract(15, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check Today minus one month 29 days', () => {
    let newDate = moment().subtract(29, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check Today plus one month 14 days', () => {
    let newDate = moment().add(14, 'd');
    newDate = newDate.add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true)
  });
  it('Check Today plus one month 29 days', () => {
    let newDate = moment().add(29, 'd');
    newDate = newDate.add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true)
  });
  it('Check blank', () => {
    const newDate = '';
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check null', () => {
    const newDate = null;
    assert(isDateBiggerThanToday(newDate) === false)
  });
  it('Check undefined', () => {
    const newDate = undefined;
    assert(isDateBiggerThanToday(newDate) === false)
  })
});

describe('SortObject', () => {
  it('Check blank', () => {
    const newObject = {}
    expect(JSON.stringify(sortObject(newObject))).toMatchSnapshot()
  });
  it('Check null', () => {
    const newObject = null
    expect(JSON.stringify(sortObject(newObject))).toMatchSnapshot()
  });
  it('Check undefined', () => {
    const newObject = undefined
    expect(JSON.stringify(sortObject(newObject))).toMatchSnapshot()
  });

  it('Check null array', () => {
    const newObject = []
    expect(JSON.stringify(sortObject(newObject))).toMatchSnapshot()
  });

  const inputObject = [
    {date:'1982-10-31T23:00:00.000Z', string: 'ååå', int: 200, intInStr: '211', float: 2.5, floatInStr: '2.5'},
    {date:'2016-10-01T23:00:00.000Z',string: 'ZZ', int: 22, intInStr: '222', float: 26.5, floatInStr: '26.5'},
    {date:'2016-10-11T23:00:00.000Z',string: 'zz', int: 333, intInStr: '11111', float: 12.5, floatInStr: '13232.5'},
    {date:'2016-11-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23', float: 222.5, floatInStr: '22332.5'},
    {date:'2003-06-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23333', float: 452.5, floatInStr: '33232.5'},
    {date:'2011-10-22T23:00:00.000Z',string: '', int: 0, intInStr: '0', float: 2.6, floatInStr: '2.8'},
    {},
    {},
    {floatInStr: '2.2'}
  ];
  it('Sort date value', () => {
    const inputObjectDate = [
      {date:'1982-10-31T23:00:00.000Z', string: 'ååå', int: 200, intInStr: '211', float: 2.5, floatInStr: '2.5'},
      {date:'2016-10-01T23:00:00.000Z',string: 'ZZ', int: 22, intInStr: '222', float: 26.5, floatInStr: '26.5'},
      {date:'2016-10-11T23:00:00.000Z',string: 'zz', int: 333, intInStr: '11111', float: 12.5, floatInStr: '13232.5'},
      {date:'2016-11-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23', float: 222.5, floatInStr: '22332.5'},
      {date:'2003-06-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23333', float: 452.5, floatInStr: '33232.5'},
      {date:'2011-10-25T23:00:00.000Z',string: '', int: 0, intInStr: '0', float: 2.6, floatInStr: '2.8'},
      {},
      {},
      {floatInStr: '2.2'}
    ];
    expect(sortObject(inputObjectDate, 'date')).toMatchSnapshot()
  });
  it('Sort string value', () => {
    const inputObject1 = [
      {stringTest: 'ZZ'},
      {stringTest: 'aa'},
      {stringTest: 'ååå'},
      {stringTest: 'AAA'},
      {stringTest: 'bb'},
      {stringTest: 'bb'},
      {stringTest: 'bb'},
      {stringTest: 'bb'},
      {stringTest: 'bb'},
      {stringTest: 'ååå'},
      {stringTest: 'ååå'},
      {stringTest: 'ååå'},
      {stringTest: '2'}
    ];
    expect(sortObject(inputObject1, 'stringTest', null, true)).toMatchSnapshot()
  });
  it('Sort int value', () => {
    expect(sortObject(inputObject, 'int')).toMatchSnapshot()
  });
  it('Sort int (intInStr) in string value', () => {
    expect(sortObject(inputObject, 'intInStr', 'number')).toMatchSnapshot()
  });
  it('Sort float in string value', () => {
    expect(sortObject(inputObject, 'float')).toMatchSnapshot()
  });
  it('Sort float (floatInStr) in string value', () => {
    expect(sortObject(inputObject, 'floatInStr', 'number')).toMatchSnapshot()
  });

  it('Sort date value descending', () => {
    const input = [
      {
        "id": 44,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:18:09+00:00",
        "eventType": "Control",
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 79,
        "doneBy": 3,
        "doneDate": "2016-10-31T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-11-01T10:40:58+00:00",
        "eventType": "Observation",
        "gas": {
          "gas": "ølæløæ"
        }
      },
      {
        "id": 73,
        "doneBy": 2,
        "doneDate": "2016-10-31T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-31T13:49:41+00:00",
        "eventType": "Observation",
        "gas": {
          "gas": "jkhjkhjkjh"
        }
      },
      {
        "id": 77,
        "doneBy": 3,
        "doneDate": "2016-11-01T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-11-01T10:08:29+00:00",
        "eventType": "Observation",
        "lightingCondition": {
          "lightingCondition": "ffgdfgdfg"
        }
      },
      {
        "id": 49,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:21:04+00:00",
        "eventType": "Control",
        "alcohol": {
          "ok": true
        },
        "cleaning": {
          "ok": true
        },
        "gas": {
          "ok": true
        },
        "hypoxicAir": {
          "ok": true
        },
        "lightingCondition": {
          "ok": true
        },
        "mold": {
          "ok": true
        },
        "pest": {
          "ok": true
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 47,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:18:24+00:00",
        "eventType": "Observation",
        "gas": {
          "gas": "ghgfhghfgh"
        }
      },
      {
        "id": 59,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:30:58+00:00",
        "eventType": "Control",
        "cleaning": {
          "ok": true
        },
        "hypoxicAir": {
          "ok": true
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 42,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:17:50+00:00",
        "eventType": "Observation",
        "lightingCondition": {
          "lightingCondition": "hfghfghgfh"
        }
      },
      {
        "id": 38,
        "doneBy": 1,
        "doneDate": "2016-10-28T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-28T13:07:07+00:00",
        "eventType": "Control",
        "hypoxicAir": {
          "ok": true
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 28,
        "doneBy": 1,
        "doneDate": "2016-10-25T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-25T11:33:51+00:00",
        "eventType": "Control",
        "alcohol": {
          "ok": true
        },
        "cleaning": {
          "ok": true
        },
        "gas": {
          "ok": true
        },
        "hypoxicAir": {
          "ok": true
        },
        "lightingCondition": {
          "ok": true
        },
        "mold": {
          "ok": true
        },
        "pest": {
          "ok": true
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 8,
        "doneBy": 1,
        "doneDate": "2015-10-24T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-24T11:15:17+00:00",
        "eventType": "Control",
        "alcohol": {
          "ok": true
        },
        "cleaning": {
          "ok": true
        },
        "gas": {
          "ok": true
        },
        "lightingCondition": {
          "ok": true
        },
        "mold": {
          "ok": false,
          "observation": {
            "note": "dfsdf",
            "mold": "dfsdfdsf"
          }
        },
        "pest": {
          "ok": false,
          "observation": {
            "note": "dfsdfsdf",
            "identification": "dfsdfsd",
            "lifecycles": [
              {
                "stage": "Adult",
                "quantity": 2
              }
            ]
          }
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 4,
        "doneBy": 1,
        "doneDate": "2016-10-24T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-24T11:14:49+00:00",
        "eventType": "Control",
        "lightingCondition": {
          "ok": true
        },
        "relativeHumidity": {
          "ok": true
        },
        "temperature": {
          "ok": true
        }
      },
      {
        "id": 2,
        "doneBy": 1,
        "doneDate": "2016-10-24T00:00:00+00:00",
        "affectedThing": 2,
        "registeredBy": "Darth Vader",
        "registeredDate": "2016-10-24T11:14:41+00:00",
        "eventType": "Observation",
        "gas": {
          "gas": "dsfdf"
        }
      }
    ]
    expect(sortObject(input, 'doneDate', null, false)).toMatchSnapshot()
  });


  it('Sort date value descending 2', () => {

    const input = [
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-31T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-31T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-11-01T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-28T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2017-10-25T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-24T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-24T00:00:00+00:00"
      },
      {
        "doneDateOnly": "2016-10-24T00:00:00+00:00"
      }
    ]
    expect(sortObject(input, 'doneDateOnly', null, false)).toMatchSnapshot()
  });

  it('Sort string value descending', () => {
    expect(sortObject(inputObject, 'string', null, false)).toMatchSnapshot()
  });
  it('Sort int value descending', () => {
    expect(sortObject(inputObject, 'int', null, false)).toMatchSnapshot()
  });
  it('Sort int (intInStr) in string value descending', () => {
    expect(sortObject(inputObject, 'intInStr', 'number', false)).toMatchSnapshot()
  });
  it('Sort float in string value descending', () => {
    expect(sortObject(inputObject, 'float', null, false)).toMatchSnapshot()
  });
  it('Sort float (floatInStr) in string value descending', () => {
    expect(sortObject(inputObject, 'floatInStr', 'number', false)).toMatchSnapshot()
  });

  const inputJsonObject = [
    {
      id: 5,
      identifier: {
        museumNo: 'C666',
        subNo: '3'
      },
      displayName: 'Øks'
    },
    {
      id: 2,
      identifier: {
        museumNo: 'C222',
        subNo: '31'
      },
      displayName: 'Sverd'
    },
    {
      id: 3,
      identifier: {
        museumNo: 'C333',
        subNo: '38'
      },
      displayName: 'Sommerfugl'
    }
  ]

  it('Sort inputJsonObject on id', () => {
    expect(sortObject(inputJsonObject, 'id')).toMatchSnapshot()
  });
  it('Sort inputJsonObject on identifier', () => {
    expect(sortObject(inputJsonObject, 'identifier')).toMatchSnapshot()
  });
  it('Sort inputJsonObject on museumNo', () => {
    expect(sortObject(inputJsonObject, 'museumNo')).toMatchSnapshot()
  });
  it('Sort inputJsonObject on subNo', () => {
    expect(sortObject(inputJsonObject, 'subNo', 'number')).toMatchSnapshot()
  });
  it('Sort inputJsonObject on displayName', () => {
    expect(sortObject(inputJsonObject, 'displayName')).toMatchSnapshot()
  });

  const pics = {
    NODE: [
      {
        marked: false,
        value: {
          id: 15,
          name: 'ccc',
          isPartOf: 3,
          groupRead: 'foo',
          path: ',1,2,3,15,',
          type: 'StorageUnit',
          updatedBy: 123,
          updatedDate: '2016-10-28T13:43:15+00:00'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          },
          {
            id: 3,
            name: 'Forskningens hus',
            url: '/magasin/3'
          }
        ]
      },
      {
        marked: false,
        value: {
          id: 7,
          name: 'bbb ',
          isPartOf: 3,
          groupRead: 'foo',
          path: ',1,2,3,7,',
          type: 'Room',
          updatedBy: 123,
          updatedDate: '2016-10-24T12:07:21+00:00'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          },
          {
            id: 3,
            name: 'Forskningens hus',
            url: '/magasin/3'
          }
        ]
      },
      {
        marked: false,
        value: {
          id: 12,
          name: 'aaa',
          isPartOf: 3,
          groupRead: 'foo',
          path: ',1,2,3,12,',
          type: 'Room',
          updatedBy: 123,
          updatedDate: '2016-10-24T16:49:13+00:00'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          },
          {
            id: 3,
            name: 'Forskningens hus ',
            url: '/magasin/3'
          }
        ]
      }
    ],
    OBJECT: [
      {
        marked: true,
        value: {
          id: 2,
          museumNo: 'MusK58 3',
          subNo: '2',
          term: 'Mansjettknapp'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          }
        ]
      },
      {
        marked: true,
        value: {
          id: 3,
          museumNo: 'MusK58 1',
          subNo: '3',
          term: 'Spenne'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          },
          {
            id: 3,
            name: 'Forskningens hus',
            url: '/magasin/3'
          },
          {
            id: 4,
            name: 'Kulturværelset',
            url: '/magasin/4'
          }
        ]
      },
      {
        marked: true,
        value: {
          id: 4,
          museumNo: 'MusK58 22',
          subNo: '4',
          term: 'Briller'
        },
        path: [
          {
            id: 2,
            name: 'Utviklingsmuseet',
            url: '/magasin/2'
          },
          {
            id: 3,
            name: 'Forskningens hus',
            url: '/magasin/3'
          },
          {
            id: 4,
            name: 'Kulturværelset',
            url: '/magasin/4'
          }
        ]
      }
    ]
  }
  it('Sort node Pics on value and name', () => {
    expect(sortObject(pics.NODE, 'value', null, true, 'name')).toMatchSnapshot()
  });
  it('Sort object Pics on value and museumNo', () => {
    expect(sortObject(pics.OBJECT, 'value', null, true, 'museumNo')).toMatchSnapshot()
  });

});
