import assert from 'assert'
import { sortObject, isDateBiggerThanToday, parseISODateNonStrict, parseISODateStrict } from '../'
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

  const inputObject = [
    {date:'1982-10-31T23:00:00.000Z', string: 'ååå', int: 100, intInStr: '211', float: 2.5, floatInStr: '2.5'},
    {date:'2016-10-01T23:00:00.000Z',string: 'ZZ', int: 22, intInStr: '222', float: 26.5, floatInStr: '26.5'},
    {date:'2016-10-11T23:00:00.000Z',string: 'zz', int: 333, intInStr: '11111', float: 12.5, floatInStr: '13232.5'},
    {date:'2016-11-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23', float: 222.5, floatInStr: '22332.5'},
    {date:'2003-06-31T23:00:00.000Z',string: 'a', int: 190, intInStr: '23333', float: 452.5, floatInStr: '33232.5'},
    {date:'2016-10-22T23:00:00.000Z',string: '', int: 0, intInStr: '0', float: 2.6, floatInStr: '2.6'},
    {},
    {floatInStr: '2.2'}
  ];
  it('Sort date value', () => {
    expect(sortObject(inputObject, 'date')).toMatchSnapshot()
  });
  it('Sort string value', () => {
    expect(sortObject(inputObject, 'string')).toMatchSnapshot()
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
});
