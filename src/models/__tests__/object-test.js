import MusitObject from '../../models/object';

describe('MusitObject model', () => {
  const mainObject = new MusitObject({
    id: 1,
    museumNo: 'AK23',
    subNo: '1',
    term: 'Rare saker',
    mainObjectId: 1
  });

  const childObject = new MusitObject({
    id: 5,
    museumNo: 'AK23',
    subNo: '1',
    term: 'Rare dingser',
    mainObjectId: 1
  });

  it('should generate proper object description', () => {
    expect(MusitObject.getObjectDescription(mainObject)).toMatchSnapshot();
  });

  it('should generate empty string on missing props', () => {
    expect(MusitObject.getObjectDescription({})).toMatchSnapshot();
  });

  it('main object should be main object', () => {
    expect(mainObject.isMainObject()).toBe(true);
  });

  it('child object should not be main object', () => {
    expect(childObject.isMainObject()).toBe(false);
  });
});