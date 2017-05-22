import { stringMapper, numberMapper, booleanMapper } from '../mappers';

describe('mappers', () => {
  describe('stringMapper', () => {
    it('toRaw should map anything to string', () => {
      expect(stringMapper.toRaw(1)).toEqual('1');
    });
    it('toRaw should map string to string', () => {
      expect(stringMapper.toRaw('1')).toEqual('1');
    });
    it('toRaw should map undefined to null', () => {
      expect(stringMapper.toRaw()).toEqual(null);
    });
    it('fromRow should map string to string', () => {
      expect(stringMapper.fromRaw('1')).toEqual('1');
    });
  });

  describe('numberMapper', () => {
    it('toRaw should map number to string', () => {
      expect(numberMapper.toRaw(1)).toEqual('1');
    });
    it('fromRaw should map string to number', () => {
      expect(numberMapper.fromRaw('1')).toEqual(1);
    });
  });

  describe('booleanMapper', () => {
    it('toRaw should map true to true', () => {
      expect(booleanMapper.toRaw(true)).toEqual(true);
    });
    it('fromRaw should map true to true', () => {
      expect(booleanMapper.fromRaw(true)).toEqual(true);
    });
    it('fromRaw should map empty string to false', () => {
      expect(booleanMapper.toRaw('')).toEqual(false);
    });
    it('fromRaw should map null to false', () => {
      expect(booleanMapper.toRaw(null)).toEqual(false);
    });
    it('fromRaw should map undefined to false', () => {
      expect(booleanMapper.toRaw()).toEqual(false);
    });
  });
});
