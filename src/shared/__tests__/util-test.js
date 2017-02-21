import assert from 'assert';
import { isDateBiggerThanToday, parseUTCDate, customSortingStorageNodeType, localToISOString } from '../util';
import moment from 'moment';

describe('parseUTCDate', () => {
  it('should accept full iso timestamp', () => {
    const date = new Date('2016-09-07T00:56:00.000Z');
    const parsed = parseUTCDate(date);
    expect(parsed).toMatchSnapshot();
  });

  it('should accept standard simple ISO date format', () => {
    const date = '2016-12-23';
    const parsed = parseUTCDate(date);
    assert(parsed.isValid() === true);
  });
});

describe('customSortingStorageNodeType', () => {
  it('Order should be Organisation < Building < Room < StorageUnit', () => {
    const unknown = customSortingStorageNodeType('errrr');
    const building = customSortingStorageNodeType('Building');
    const organisation = customSortingStorageNodeType('Organisation');
    const storageUnit = customSortingStorageNodeType('StorageUnit');
    const room = customSortingStorageNodeType('Room');
    assert(organisation < building && building < room && room < storageUnit && storageUnit < unknown);
  });

});


describe('isDateBiggerThanToday', () => {
  it('Check Today', () => {
    const newDate = moment();
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check one day plus Today', () => {
    const newDate = moment().add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true);
  });
  it('Check one month plus Today', () => {
    const newDate = moment().add(1, 'M');
    assert(isDateBiggerThanToday(newDate) === true);
  });
  it('Check one year plus Today', () => {
    const newDate = moment().add(1, 'y');
    assert(isDateBiggerThanToday(newDate) === true);
  });
  it('Check one day subtract from Today', () => {
    const newDate = moment().subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check one month subtract from Today', () => {
    const newDate = moment().subtract(2, 'M');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check one year subtract from Today', () => {
    const newDate = moment().subtract(1, 'y');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check Today minus one month three days', () => {
    let newDate = moment().subtract(3, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check Today minus one month 15 days', () => {
    let newDate = moment().subtract(15, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check Today minus one month 29 days', () => {
    let newDate = moment().subtract(29, 'd');
    newDate = newDate.subtract(1, 'd');
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check Today plus one month 14 days', () => {
    let newDate = moment().add(14, 'd');
    newDate = newDate.add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true);
  });
  it('Check Today plus one month 29 days', () => {
    let newDate = moment().add(29, 'd');
    newDate = newDate.add(1, 'd');
    assert(isDateBiggerThanToday(newDate) === true);
  });
  it('Check blank', () => {
    const newDate = '';
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check null', () => {
    const newDate = null;
    assert(isDateBiggerThanToday(newDate) === false);
  });
  it('Check undefined', () => {
    const newDate = undefined;
    assert(isDateBiggerThanToday(newDate) === false);
  });
});



describe('localToISOString', () => {

  it('localTOIsoString should always be equal to input date', () => {
    const newDate = new Date();
    const isoDat= localToISOString(newDate);
    assert(moment(newDate).format('YYYYMMDD') === moment(isoDat).format('YYYYMMDD'));
  });

  it('CheckAroundMidnight', () => {
    const newDate = new Date('2017-02-20T00:00:01');
    const isoDate= localToISOString(newDate);
    assert(moment(newDate).format('YYYYMMDD') === moment(isoDate).format('YYYYMMDD'));
  });

});


describe('toISOString', () => {

  it('Date local time should not be equal to isoDate if local time has timeZoneOffset <> 0', () => {
    const d = new Date();
    const momentLocal = moment(d); // Local date
    const i = momentLocal.toISOString().split('.')[0]; // Zulu time (without milliseconds)
    const l = momentLocal.format('YYYY-MM-DDTHH:mm:ssZ');
    assert(d.getTimezoneOffset() !== 0 || i !== l); // If timeZone is different from zulu, local should be different from isoString
  });
});

describe('parseUTC around midnight', () => {

  it('It shows wrong local date around midnight if local zone is GMT+1', () => {
    const str = '2017-01-12T00:01:00.000+01:00';
    const d = new Date(str);
    const m = moment(d).format('YYYYMMDD');
    const p = parseUTCDate(str).format('YYYYMMDD');
    assert(m !== p );
  });
});
