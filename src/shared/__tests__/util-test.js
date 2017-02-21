import { isDateBiggerThanToday, parseUTCDate, parseISODate, customSortingStorageNodeType, formatISOString } from '../util';
import moment from 'moment';
import { expect as expectChai } from 'chai';

describe('parseUTCDate', () => {
  it('should accept full iso timestamp', () => {
    const date = new Date('2016-09-07T00:56:00.000Z');
    const parsed = parseUTCDate(date);
    expect(parsed).toMatchSnapshot();
  });

  it('should accept standard simple ISO date format', () => {
    const date = '2016-12-23';
    const parsed = parseUTCDate(date);
    expectChai(parsed.isValid()).to.equal(true);
  });
});

describe('customSortingStorageNodeType', () => {
  it('Order should be Organisation < Building < Room < StorageUnit', () => {
    const unknown = customSortingStorageNodeType('errrr');
    const building = customSortingStorageNodeType('Building');
    const organisation = customSortingStorageNodeType('Organisation');
    const storageUnit = customSortingStorageNodeType('StorageUnit');
    const room = customSortingStorageNodeType('Room');
    expectChai(organisation).to.be.below(building).to.be.below(room).to.be.below(storageUnit).to.be.below(unknown);
  });
});


describe('isDateBiggerThanToday', () => {
  it('Check Today', () => {
    const newDate = moment();
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check one day plus Today', () => {
    const newDate = moment().add(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(true);
  });
  it('Check one month plus Today', () => {
    const newDate = moment().add(1, 'M');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(true);
  });
  it('Check one year plus Today', () => {
    const newDate = moment().add(1, 'y');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(true);
  });
  it('Check one day subtract from Today', () => {
    const newDate = moment().subtract(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check one month subtract from Today', () => {
    const newDate = moment().subtract(2, 'M');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check one year subtract from Today', () => {
    const newDate = moment().subtract(1, 'y');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check Today minus one month three days', () => {
    let newDate = moment().subtract(3, 'd');
    newDate = newDate.subtract(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check Today minus one month 15 days', () => {
    let newDate = moment().subtract(15, 'd');
    newDate = newDate.subtract(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check Today minus one month 29 days', () => {
    let newDate = moment().subtract(29, 'd');
    newDate = newDate.subtract(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check Today plus one month 14 days', () => {
    let newDate = moment().add(14, 'd');
    newDate = newDate.add(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(true);
  });
  it('Check Today plus one month 29 days', () => {
    let newDate = moment().add(29, 'd');
    newDate = newDate.add(1, 'd');
    expectChai(isDateBiggerThanToday(newDate)).to.equal(true);
  });
  it('Check blank', () => {
    const newDate = '';
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check null', () => {
    const newDate = null;
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
  it('Check undefined', () => {
    const newDate = undefined;
    expectChai(isDateBiggerThanToday(newDate)).to.equal(false);
  });
});



describe('localToISOString', () => {

  it('localTOIsoString should always be equal to input date', () => {
    const newDate = new Date();
    const isoDat= formatISOString(newDate);
    expectChai(moment(newDate).format('YYYYMMDD')).to.equal(moment(isoDat).format('YYYYMMDD'));
  });

  it('CheckAroundMidnight', () => {
    const newDate = new Date('2017-02-20T00:00:01');
    const isoDate= formatISOString(newDate);
    expectChai(moment(newDate).format('YYYYMMDD')).to.equal(moment(isoDate).format('YYYYMMDD'));
  });

});


describe('parseUTC and parseLocalDate around midnight', () => {

  const str = '2017-01-12T00:01:00.000+01:00';

  it('parseUTC shows wrong local date around midnight if local zone is GMT+1', () => {
    const d = new Date(str);
    const localDate = moment(d).format('YYYYMMDD');
    const upcDate = parseUTCDate(str).format('YYYYMMDD');

    expectChai(localDate).to.not.equal(upcDate);
  });

  it('parseLocalDate shows correct local date around midnight if local zone is GMT+1', () => {
    const d = new Date(str);
    const localDate = moment(d).format('YYYYMMDD');
    const parsedISODate = parseISODate(str).format('YYYYMMDD');
    expectChai(localDate).to.equal(parsedISODate);
  });
});

describe('parseISOString and formatISOString are inverse functions', () => {

  it('Show inverseness on dates from times right before midnight', () => {
    const isoStr = '1999-12-31T23:59:59.999+01:00';
    const date = new Date(isoStr);
    const dateStr = 'YYYY-MM-DD';
    const localDate = moment(date).format(dateStr);
    const dateAfterFormatISOString = moment(formatISOString(date)).format(dateStr);
    const dateAfterParsedISODate = parseISODate(isoStr).format('YYYY-MM-DD');
    expectChai(localDate).to.equal(dateAfterFormatISOString).and.equal(dateAfterParsedISODate);
  });


  it('Show inverseness on dates from times right after midnight', () => {
    const isoStr = '1999-12-31T00:59:59.999+01:00';
    const date = new Date(isoStr);
    const dateStr = 'YYYY-MM-DD';
    const localDate = moment(date).format(dateStr);
    const dateAfterFormatISOString = moment(formatISOString(date)).format(dateStr);
    const dateAfterParsedISODate = parseISODate(isoStr).format('YYYY-MM-DD');
    expectChai(localDate).to.equal(dateAfterFormatISOString).and.equal(dateAfterParsedISODate);
  });
});
