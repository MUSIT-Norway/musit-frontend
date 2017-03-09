import { stringMapper, numberMapper, specialPhoneMapper } from '../mappers';

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

  describe('phoneMapper', () => {
    it('toRaw should map phone to string', () => {
      expect(specialPhoneMapper.toRaw({ ext: 22, num: 45 })).toEqual('22-45');
    });
    it('fromRaw should map string to phone', () => {
      expect(specialPhoneMapper.fromRaw('22-45')).toEqual({ ext: 22, num: 45 });
    });
  });
});