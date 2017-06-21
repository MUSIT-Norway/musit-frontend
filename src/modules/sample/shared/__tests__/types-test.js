import {
  getSampleType,
  getSampleSubType,
  getSampleSubTypeWithSlash,
  getSampleTypeAndSubType
} from '../types';

const sampleTypes = {
  data: [],
  sampleTypes: [
    {
      sampleTypeId: 1,
      noSampleType: 'DNA-ekstrakt',
      enSampleType: 'DNA extract',
      noSampleSubType: 'aDNA',
      enSampleSubType: 'aDNA'
    },
    {
      sampleTypeId: 2,
      noSampleType: 'DNA-ekstrakt',
      enSampleType: 'DNA extract',
      noSampleSubType: 'eDNA',
      enSampleSubType: 'eDNA'
    },
    {
      sampleTypeId: 3,
      noSampleType: 'DNA-ekstrakt',
      enSampleType: 'DNA extract',
      noSampleSubType: 'gDNA',
      enSampleSubType: 'gDNA'
    },
    {
      sampleTypeId: 4,
      noSampleType: 'DNA-ekstrakt',
      enSampleType: 'DNA extract',
      noSampleSubType: 'rDNA',
      enSampleSubType: 'rDNA'
    },
    {
      sampleTypeId: 5,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Frø',
      enSampleSubType: 'Seed'
    },
    {
      sampleTypeId: 6,
      noSampleType: 'Levende individ',
      enSampleType: 'Living individual'
    },
    {
      sampleTypeId: 7,
      noSampleType: 'Parasitt',
      enSampleType: 'Parasite',
      noSampleSubType: 'Ektoparasitt',
      enSampleSubType: 'Ectoparasite'
    },
    {
      sampleTypeId: 8,
      noSampleType: 'Parasitt',
      enSampleType: 'Parasite',
      noSampleSubType: 'Endoparasitt',
      enSampleSubType: 'Endoparasite'
    },
    { sampleTypeId: 9, noSampleType: 'RNA-bibliotek', enSampleType: 'RNA library' },
    {
      sampleTypeId: 10,
      noSampleType: 'RNA-ekstrakt',
      enSampleType: 'RNA extract'
    },
    {
      sampleTypeId: 11,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Apothecia',
      enSampleSubType: 'Apothecia'
    },
    {
      sampleTypeId: 12,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Bein',
      enSampleSubType: 'Bone'
    },
    {
      sampleTypeId: 13,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Binde- og støttevev',
      enSampleSubType: 'Connective tissue'
    },
    {
      sampleTypeId: 14,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Blad',
      enSampleSubType: 'Leaf'
    },
    {
      sampleTypeId: 15,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Blod',
      enSampleSubType: 'Blood'
    },
    {
      sampleTypeId: 16,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Epitelvev',
      enSampleSubType: 'Epithelial tissue'
    },
    {
      sampleTypeId: 17,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Fjær',
      enSampleSubType: 'Feather'
    },
    {
      sampleTypeId: 18,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Føtter',
      enSampleSubType: 'Legs'
    },
    {
      sampleTypeId: 19,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Grunnvev',
      enSampleSubType: 'Ground tissue'
    },
    {
      sampleTypeId: 20,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Hale',
      enSampleSubType: 'Tail'
    },
    {
      sampleTypeId: 21,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Hjerne',
      enSampleSubType: 'Brain'
    },
    {
      sampleTypeId: 22,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Hudvev',
      enSampleSubType: 'Epidermis'
    },
    {
      sampleTypeId: 23,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Hår',
      enSampleSubType: 'Hair'
    },
    {
      sampleTypeId: 24,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Knokkel',
      enSampleSubType: 'Bone'
    },
    {
      sampleTypeId: 25,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Ledningsvev',
      enSampleSubType: 'Vascular tissue'
    },
    {
      sampleTypeId: 26,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Lever',
      enSampleSubType: 'Liver'
    },
    {
      sampleTypeId: 27,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Muskel',
      enSampleSubType: 'Muscle'
    },
    {
      sampleTypeId: 28,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Nervevev',
      enSampleSubType: 'Nervous tissue'
    },
    {
      sampleTypeId: 29,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Plasma',
      enSampleSubType: 'Plasma'
    },
    {
      sampleTypeId: 30,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Skinn',
      enSampleSubType: 'Skin'
    },
    {
      sampleTypeId: 31,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Soredia',
      enSampleSubType: 'Soredia'
    },
    {
      sampleTypeId: 32,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Testikkel',
      enSampleSubType: 'Testicle'
    },
    {
      sampleTypeId: 33,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Thallus',
      enSampleSubType: 'Thallus'
    },
    {
      sampleTypeId: 34,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Tåpute',
      enSampleSubType: 'Toe pad'
    },
    {
      sampleTypeId: 35,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Vinge',
      enSampleSubType: 'Wing'
    },
    {
      sampleTypeId: 36,
      noSampleType: 'Vev',
      enSampleType: 'Tissue',
      noSampleSubType: 'Øre',
      enSampleSubType: 'Ear'
    },
    { sampleTypeId: 37, noSampleType: 'Materiale', enSampleType: 'Material' }
  ]
};

const appSession = {
  accessToken: '9c94c6fc-078e-4c43-8544-cfca888243ff',
  actor: {
    fn: 'Rituvesh Kumar',
    email: 'rituvesh.kumar@usit.uio.no',
    dataportenId: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
    dataportenUser: 'rituvesk@uio.no'
  },
  groups: [
    {
      id: 99,
      shortName: 'Test',
      museumId: 99,
      museumName: 'Test',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 7,
      shortName: 'Kmn',
      museumId: 7,
      museumName: 'Kmn',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 6,
      shortName: 'Tmu',
      museumId: 6,
      museumName: 'Tmu',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 5,
      shortName: 'Vm',
      museumId: 5,
      museumName: 'Vm',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 4,
      shortName: 'Nhm',
      museumId: 4,
      museumName: 'Nhm',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 3,
      shortName: 'Khm',
      museumId: 3,
      museumName: 'Khm',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 2,
      shortName: 'Um',
      museumId: 2,
      museumName: 'Um',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    },
    {
      id: 1,
      shortName: 'Am',
      museumId: 1,
      museumName: 'Am',
      permission: 10000,
      collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
    }
  ],
  museumId: 99,
  collectionId: '00000000-0000-0000-0000-000000000000',
  buildInfo: {
    builtAtMillis: '1496734498814',
    name: 'service_auth',
    scalaVersion: '2.11.8',
    buildInfoBuildNumber: '75',
    version: '0.1-SNAPSHOT',
    sbtVersion: '0.13.15',
    commitSha: 'not built on CI',
    builtAtString: '2017-06-06 07:34:58.814'
  },
  language: { isEn: true, isNo: false }
};

describe('getSampleType', () => {
  it('should have working getSampleType method', () => {
    const sampleType = getSampleType(sampleTypes, 1, appSession);
    expect(sampleType).toBe('DNA extract');
  });
});

describe('getSampleSubType', () => {
  it('should have working getSampleSubType method', () => {
    const sampleType = getSampleSubType(sampleTypes, 2, appSession);
    expect(sampleType).toBe('eDNA');
  });
});

describe('getSampleSubTypeWithSlash', () => {
  it('should have working getSampleSubTypeWithSlash method', () => {
    const sampleType = getSampleSubTypeWithSlash(sampleTypes, 1, appSession);
    expect(sampleType).toBe(' / aDNA');
  });
});

describe('getSampleTypeAndSubType', () => {
  it('should have working getSampleTypeAndSubType method', () => {
    const sampleType = getSampleTypeAndSubType(sampleTypes, 1, appSession);
    expect(sampleType).toBe('DNA extract / aDNA');
  });
});

describe('getSampleTypeAndSubType', () => {
  it('should have working getSampleTypeAndSubType method with no subType', () => {
    const sampleType = getSampleTypeAndSubType(sampleTypes, 6, appSession);
    expect(sampleType).toBe('Living individual');
  });
});
