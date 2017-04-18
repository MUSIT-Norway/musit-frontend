import MusitObject from '../object';

describe('Object model', () => {
  it('should work', () => {
    const obj = {
      id: 1,
      term: 'Fugl',
      museumNo: 'Kask123',
      subNo: '1',
      mainObjectId: 1
    };
    expect(MusitObject.getObjectDescription(obj)).toEqual('Kask123 - 1 - Fugl');
    expect(MusitObject.isMainObject(obj)).toBe(true);
  });
});
