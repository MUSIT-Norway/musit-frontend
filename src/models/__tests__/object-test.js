import MusitObject from '../object';

describe('Object model', () => {
  it('should work', () => {
    const obj = new MusitObject({
      id: 1,
      term: 'Fugl',
      museumNo: 'Kask123',
      subNo: '1',
      mainObjectId: 1
    });
    expect(obj.getObjectDescription()).toEqual('Kask123 - 1 - Fugl');
    expect(obj.isMainObject()).toBe(true);
  });
});
