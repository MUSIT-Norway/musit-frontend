import assert from 'assert';
import { isDateBiggerThanToday, parseUTCDate, customSortingStorageNodeType } from '../';
import moment from 'moment';

describe('parseUTCDate', () => {
  it('should accept full iso timestamp', () => {
    const date = '2016-09-07T22:56:00.000Z';
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