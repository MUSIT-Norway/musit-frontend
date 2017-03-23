import MusitObject from '../object';

describe('Object model', () => {
  it('should work', () => {
    const obj = new MusitObject({ term: 'Fugl', museumNo: 'Kask123', subNo: '1' });
    expect(obj.getObjectDescription()).toEqual('Kask123 - 1 - Fugl');
  });
});