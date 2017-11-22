// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ConservationComponent from '../conservationComponent';

const editPageProps: any = {
  appSession: {
    accessToken: '7dbce915-c87a-47c1-8666-c858f3624d0d',
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
      builtAtMillis: '1511169267488',
      name: 'service_auth',
      scalaVersion: '2.11.8',
      buildInfoBuildNumber: '31',
      version: '0.1-SNAPSHOT',
      sbtVersion: '0.13.16',
      commitSha: 'not built on CI',
      builtAtString: '2017-11-20 09:14:27.488'
    },
    language: { isEn: true, isNo: false }
  },
  predefinedConservation: {
    sampleTypes: {
      'DNA extract': [
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
        }
      ],
      Tissue: [
        {
          sampleTypeId: 5,
          noSampleType: 'Vev',
          enSampleType: 'Tissue',
          noSampleSubType: 'Frø',
          enSampleSubType: 'Seed'
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
        }
      ],
      'Living individual': [
        {
          sampleTypeId: 6,
          noSampleType: 'Levende individ',
          enSampleType: 'Living individual'
        }
      ],
      Parasite: [
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
        }
      ],
      'RNA library': [
        { sampleTypeId: 9, noSampleType: 'RNA-bibliotek', enSampleType: 'RNA library' }
      ],
      'RNA extract': [
        { sampleTypeId: 10, noSampleType: 'RNA-ekstrakt', enSampleType: 'RNA extract' }
      ],
      Material: [
        { sampleTypeId: 37, noSampleType: 'Materiale', enSampleType: 'Material' }
      ],
      'Archaeological material': [
        {
          sampleTypeId: 38,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'leire ',
          enSampleSubType: 'clay'
        },
        {
          sampleTypeId: 39,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lerret',
          enSampleSubType: 'canvas'
        },
        {
          sampleTypeId: 40,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lin',
          enSampleSubType: 'flax'
        },
        {
          sampleTypeId: 41,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lær',
          enSampleSubType: 'leather'
        }
      ],
      'Ethnografic material': [
        {
          sampleTypeId: 164,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'agat',
          enSampleSubType: 'agate'
        },
        {
          sampleTypeId: 165,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'akryl',
          enSampleSubType: 'acrylic'
        },
        {
          sampleTypeId: 166,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'alabast',
          enSampleSubType: 'alabaster'
        },
        {
          sampleTypeId: 167,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'ametyst',
          enSampleSubType: 'amethyst'
        }
      ],
      'Numismatic material': [
        {
          sampleTypeId: 376,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Porselen',
          enSampleSubType: 'Porcelain'
        },
        {
          sampleTypeId: 377,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Sink',
          enSampleSubType: 'Zink'
        },
        {
          sampleTypeId: 378,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Stål',
          enSampleSubType: 'Steel'
        }
      ],
      'Sediment and soil samples': [
        {
          sampleTypeId: 380,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'C/N prøver',
          enSampleSubType: 'C/N samples'
        },
        {
          sampleTypeId: 381,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Jordmikromorfologiske prøver',
          enSampleSubType: 'Soil micromorphology samples'
        },
        {
          sampleTypeId: 382,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Kornfordelingsprøver',
          enSampleSubType: 'Grain size distribution (GSD) samples'
        }
      ],
      raw: [
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
        { sampleTypeId: 10, noSampleType: 'RNA-ekstrakt', enSampleType: 'RNA extract' },
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
        { sampleTypeId: 37, noSampleType: 'Materiale', enSampleType: 'Material' },
        {
          sampleTypeId: 38,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'leire ',
          enSampleSubType: 'clay'
        },
        {
          sampleTypeId: 39,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lerret',
          enSampleSubType: 'canvas'
        },
        {
          sampleTypeId: 40,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lin',
          enSampleSubType: 'flax'
        },
        {
          sampleTypeId: 41,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lær',
          enSampleSubType: 'leather'
        },
        {
          sampleTypeId: 164,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'agat',
          enSampleSubType: 'agate'
        },
        {
          sampleTypeId: 165,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'akryl',
          enSampleSubType: 'acrylic'
        },
        {
          sampleTypeId: 166,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'alabast',
          enSampleSubType: 'alabaster'
        },
        {
          sampleTypeId: 167,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'ametyst',
          enSampleSubType: 'amethyst'
        },
        {
          sampleTypeId: 376,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Porselen',
          enSampleSubType: 'Porcelain'
        },
        {
          sampleTypeId: 377,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Sink',
          enSampleSubType: 'Zink'
        },
        {
          sampleTypeId: 378,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Stål',
          enSampleSubType: 'Steel'
        },
        {
          sampleTypeId: 380,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'C/N prøver',
          enSampleSubType: 'C/N samples'
        },
        {
          sampleTypeId: 381,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Jordmikromorfologiske prøver',
          enSampleSubType: 'Soil micromorphology samples'
        },
        {
          sampleTypeId: 382,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Kornfordelingsprøver',
          enSampleSubType: 'Grain size distribution (GSD) samples'
        }
      ]
    },
    loadingSampleTypes: false,
    conservationTypes: [
      {
        id: 1,
        noName: 'konserveringsprosess',
        enName: 'conservation process',
        collections: []
      },
      {
        id: 2,
        noName: 'behandling',
        enName: 'treatment',
        collections: ['ba3d4d30-810b-4c07-81b3-37751f2196f0']
      },
      {
        id: 3,
        noName: 'teknisk beskrivelse',
        enName: 'technical description',
        collections: []
      }
    ],
    loadingConservationTypes: false,
    keywordList: [
      { id: 1, noTerm: 'Støvsuget', enTerm: 'Støvsuget' },
      { id: 2, noTerm: 'Børstet', enTerm: 'Børstet' },
      { id: 3, noTerm: 'Kjemisk rensing', enTerm: 'Kjemisk rensing' },
      { id: 4, noTerm: 'Mekanisk rensing', enTerm: 'Mekanisk rensing' },
      { id: 5, noTerm: 'Utvasking', enTerm: 'Utvasking' },
      { id: 6, noTerm: 'Sandblåst', enTerm: 'Sandblåst' },
      { id: 7, noTerm: 'Limt', enTerm: 'Limt' },
      { id: 8, noTerm: 'Impregnert', enTerm: 'Impregnert' },
      { id: 9, noTerm: 'Konsolidert', enTerm: 'Konsolidert' },
      { id: 10, noTerm: 'Frysetørket', enTerm: 'Frysetørket' },
      { id: 11, noTerm: 'Retusjert', enTerm: 'Retusjert' },
      { id: 12, noTerm: 'Pakket', enTerm: 'Pakket' },
      { id: 13, noTerm: 'Lufttørket', enTerm: 'Lufttørket' },
      { id: 14, noTerm: 'Slipt (maskinelt)', enTerm: 'Slipt (maskinelt)' },
      { id: 15, noTerm: 'Avstøpning', enTerm: 'Avstøpning' },
      { id: 16, noTerm: 'Lakkert', enTerm: 'Lakkert' }
    ],
    materialList: [
      { id: 1, noTerm: 'Sitronsyre', enTerm: 'Sitronsyre' },
      { id: 2, noTerm: 'Klucel EF', enTerm: 'Klucel EF' },
      { id: 3, noTerm: 'Klucel G', enTerm: 'Klucel G' },
      {
        id: 4,
        noTerm: 'Lascaux Medium for konsolidering',
        enTerm: 'Lascaux Medium for konsolidering'
      },
      { id: 5, noTerm: 'Aceton', enTerm: 'Aceton' },
      { id: 6, noTerm: 'Rochelle salt', enTerm: 'Rochelle salt' },
      { id: 7, noTerm: 'Aluminiumsoksid', enTerm: 'Aluminiumsoksid' },
      { id: 8, noTerm: 'Ammoniakk', enTerm: 'Ammoniakk' },
      { id: 9, noTerm: 'Ammoniumhydroksid', enTerm: 'Ammoniumhydroksid' },
      { id: 10, noTerm: 'Benzen', enTerm: 'Benzen' },
      { id: 11, noTerm: 'Benzotriasol (BTA)', enTerm: 'Benzotriasol (BTA)' },
      { id: 12, noTerm: 'Cellulosenitrat', enTerm: 'Cellulosenitrat' },
      { id: 13, noTerm: 'Kolofonium', enTerm: 'Kolofonium' },
      { id: 14, noTerm: 'Cyanoakrylat (superlim)', enTerm: 'Cyanoakrylat (superlim)' },
      { id: 15, noTerm: 'Eddiksyre', enTerm: 'Eddiksyre' },
      { id: 16, noTerm: 'EDTA-Na2', enTerm: 'EDTA-Na2' },
      { id: 17, noTerm: 'EDTA', enTerm: 'EDTA' },
      { id: 18, noTerm: 'Epoxylim', enTerm: 'Epoxylim' },
      { id: 19, noTerm: 'Etanol', enTerm: 'Etanol' },
      { id: 20, noTerm: 'Smeltelim (EVA)', enTerm: 'Smeltelim (EVA)' },
      { id: 21, noTerm: 'Fosforsyre', enTerm: 'Fosforsyre' },
      { id: 22, noTerm: 'Gasil 23', enTerm: 'Gasil 23' },
      { id: 23, noTerm: 'Gips', enTerm: 'Gips' },
      { id: 24, noTerm: 'Glassfibervev', enTerm: 'Glassfibervev' },
      { id: 25, noTerm: 'Glasspulver', enTerm: 'Glasspulver' },
      { id: 26, noTerm: 'Glycerin', enTerm: 'Glycerin' },
      { id: 27, noTerm: 'Hydrogenperoksid', enTerm: 'Hydrogenperoksid' },
      { id: 28, noTerm: 'Incralac', enTerm: 'Incralac' },
      { id: 29, noTerm: 'Isopropanol', enTerm: 'Isopropanol' },
      { id: 30, noTerm: 'Japanpapir', enTerm: 'Japanpapir' },
      { id: 31, noTerm: 'Lissapol N', enTerm: 'Lissapol N' },
      { id: 32, noTerm: 'Maursyre', enTerm: 'Maursyre' },
      { id: 33, noTerm: 'Mannitol', enTerm: 'Mannitol' },
      { id: 34, noTerm: 'Mikrokrystallinsk voks', enTerm: 'Mikrokrystallinsk voks' },
      { id: 35, noTerm: 'Natriumkarbonat', enTerm: 'Natriumkarbonat' },
      { id: 36, noTerm: 'Natriumsitrat', enTerm: 'Natriumsitrat' },
      { id: 37, noTerm: 'Natriumhydrogenkarbonat', enTerm: 'Natriumhydrogenkarbonat' },
      { id: 38, noTerm: 'Natriumhydroksyd', enTerm: 'Natriumhydroksyd' },
      { id: 39, noTerm: 'Paraloid B72', enTerm: 'Paraloid B72' },
      { id: 40, noTerm: 'PEG høymolekylær (fast)', enTerm: 'PEG høymolekylær (fast)' },
      {
        id: 41,
        noTerm: 'Petroleumsether kpkt 60-80 grader',
        enTerm: 'Petroleumsether kpkt 60-80 grader'
      },
      { id: 42, noTerm: 'Plextol B500', enTerm: 'Plextol B500' },
      { id: 43, noTerm: 'Polyolefin', enTerm: 'Polyolefin' },
      { id: 44, noTerm: 'Polyvinylacetat', enTerm: 'Polyvinylacetat' },
      { id: 45, noTerm: 'Primal WS24', enTerm: 'Primal WS24' },
      { id: 46, noTerm: 'Salpetersyre', enTerm: 'Salpetersyre' },
      { id: 47, noTerm: 'Saltsyre', enTerm: 'Saltsyre' },
      { id: 48, noTerm: 'Skjellakk', enTerm: 'Skjellakk' },
      { id: 49, noTerm: 'Silikagel', enTerm: 'Silikagel' },
      { id: 50, noTerm: 'Silikonfett', enTerm: 'Silikonfett' },
      { id: 51, noTerm: 'Silikongummi', enTerm: 'Silikongummi' },
      { id: 52, noTerm: 'Silver Polish Wadding', enTerm: 'Silver Polish Wadding' },
      { id: 53, noTerm: 'Sølvnitrat', enTerm: 'Sølvnitrat' },
      { id: 54, noTerm: 'Sorbitol', enTerm: 'Sorbitol' },
      { id: 55, noTerm: 'Størlim', enTerm: 'Størlim' },
      { id: 56, noTerm: 'Svovelsyre', enTerm: 'Svovelsyre' },
      { id: 57, noTerm: 'Synocryl 9122x', enTerm: 'Synocryl 9122x' },
      { id: 58, noTerm: 'Tannin syre', enTerm: 'Tannin syre' },
      { id: 59, noTerm: 'Terpentin', enTerm: 'Terpentin' },
      { id: 60, noTerm: 'Tiourea', enTerm: 'Tiourea' },
      { id: 61, noTerm: 'Toluen', enTerm: 'Toluen' },
      { id: 62, noTerm: 'White spirit', enTerm: 'White spirit' },
      {
        id: 63,
        noTerm: 'White spirit, lavaromatisk',
        enTerm: 'White spirit, lavaromatisk'
      },
      { id: 64, noTerm: 'Vann', enTerm: 'Vann' },
      { id: 65, noTerm: 'Vann (destillert)', enTerm: 'Vann (destillert)' },
      { id: 66, noTerm: 'Vann (avionisert)', enTerm: 'Vann (avionisert)' },
      { id: 67, noTerm: 'Xylen', enTerm: 'Xylen' },
      {
        id: 68,
        noTerm: 'PEG lavmoelkylær (flytende)',
        enTerm: 'PEG lavmoelkylær (flytende)'
      },
      { id: 69, noTerm: 'Paraloid B44', enTerm: 'Paraloid B44' },
      { id: 70, noTerm: 'Paraloid B 67', enTerm: 'Paraloid B 67' },
      { id: 71, noTerm: 'Technovit 5071', enTerm: 'Technovit 5071' },
      { id: 72, noTerm: 'Natriumsulfitt', enTerm: 'Natriumsulfitt' },
      { id: 73, noTerm: 'Valnøttskall', enTerm: 'Valnøttskall' }
    ]
  },
  store: {
    loadingConservation: false,
    conservation: {
      id: 112,
      eventTypeId: 1,
      caseNumber: 'cvxcvx',
      registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      registeredDate: '2017-11-21T13:54:28+00:00',
      updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      updatedDate: '2017-11-21T15:14:29+00:00',
      note: 'bcvbcv',
      affectedThings: [
        {
          objectData: {
            id: 28,
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 1,
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 2,
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 9,
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 8,
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        }
      ],
      events: [
        {
          id: 113,
          eventTypeId: 2,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T13:54:28+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfdfsdfsdf',
          affectedThings: [
            'ad1b5287-0168-4343-b3df-a477de113bee',
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ],
          keywords: [2],
          materials: [2]
        },
        {
          id: 114,
          eventTypeId: 3,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T15:09:41+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfsdfsdfsd',
          affectedThings: [
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ]
        }
      ],
      updatedByName: 'Rituvesh Kumar',
      registeredByName: 'Rituvesh Kumar'
    }
  },
  form: {
    id: {
      name: 'id',
      defaultValue: 112,
      value: '112',
      rawValue: '112',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    eventTypeId: {
      name: 'eventTypeId',
      defaultValue: 1,
      value: 1,
      rawValue: '1',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    doneBy: {
      name: 'doneBy',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    doneDate: {
      name: 'doneDate',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    participating: {
      name: 'participating',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    participatingName: {
      name: 'participatingName',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    persons: {
      name: 'persons',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredBy: {
      name: 'registeredBy',
      defaultValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      value: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      rawValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredByName: {
      name: 'registeredByName',
      defaultValue: 'Rituvesh Kumar',
      value: 'Rituvesh Kumar',
      rawValue: 'Rituvesh Kumar',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredDate: {
      name: 'registeredDate',
      defaultValue: '2017-11-21T13:54:28+00:00',
      value: '2017-11-21T13:54:28+00:00',
      rawValue: '2017-11-21T13:54:28+00:00',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    note: {
      name: 'note',
      defaultValue: 'bcvbcv',
      value: 'bcvbcv',
      rawValue: 'bcvbcv',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    caseNumber: {
      name: 'caseNumber',
      defaultValue: 'cvxcvx',
      value: 'cvxcvx',
      rawValue: 'cvxcvx',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    affectedThings: {
      name: 'affectedThings',
      defaultValue: [
        {
          objectData: {
            id: 28,
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 1,
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 2,
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 9,
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 8,
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        }
      ],
      value: [
        {
          objectData: {
            id: 28,
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 1,
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 2,
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 9,
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 8,
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        }
      ],
      rawValue: [
        {
          objectData: {
            id: 28,
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 1,
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 2,
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 9,
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 8,
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        }
      ],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    objects: {
      name: 'objects',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedBy: {
      name: 'updatedBy',
      defaultValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      value: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      rawValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedByName: {
      name: 'updatedByName',
      defaultValue: 'Rituvesh Kumar',
      value: 'Rituvesh Kumar',
      rawValue: 'Rituvesh Kumar',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedDate: {
      name: 'updatedDate',
      defaultValue: '2017-11-21T15:14:29+00:00',
      value: '2017-11-21T15:14:29+00:00',
      rawValue: '2017-11-21T15:14:29+00:00',
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    subEventTypes: {
      name: 'subEventTypes',
      defaultValue: '',
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    events: {
      name: 'events',
      defaultValue: [
        {
          id: 113,
          eventTypeId: 2,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T13:54:28+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfdfsdfsdf',
          affectedThings: [
            'ad1b5287-0168-4343-b3df-a477de113bee',
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ],
          keywords: [2],
          materials: [2]
        },
        {
          id: 114,
          eventTypeId: 3,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T15:09:41+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfsdfsdfsd',
          affectedThings: [
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ]
        }
      ],
      value: [
        {
          id: 113,
          eventTypeId: 2,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T13:54:28+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfdfsdfsdf',
          affectedThings: [
            'ad1b5287-0168-4343-b3df-a477de113bee',
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ],
          keywords: [2],
          materials: [2]
        },
        {
          id: 114,
          eventTypeId: 3,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T15:09:41+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfsdfsdfsd',
          affectedThings: [
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ]
        }
      ],
      rawValue: [
        {
          id: 113,
          eventTypeId: 2,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T13:54:28+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfdfsdfsdf',
          affectedThings: [
            'ad1b5287-0168-4343-b3df-a477de113bee',
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ],
          keywords: [2],
          materials: [2]
        },
        {
          id: 114,
          eventTypeId: 3,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredDate: '2017-11-21T15:09:41+00:00',
          updatedBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          updatedDate: '2017-11-21T15:14:29+00:00',
          partOf: 112,
          note: 'dfsdfsdfsd',
          affectedThings: [
            'adea8141-8099-4f67-bff9-ea5090e18335',
            '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            '41be3c71-a71b-486d-a265-c3a92672f4cf'
          ]
        }
      ],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    }
  },
  match: {
    path:
      '/museum/:museumId/collections/:collectionIds/conservation/edit/:conservationId',
    url:
      '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/edit/112',
    isExact: true,
    params: {
      museumId: '99',
      collectionIds: '00000000-0000-0000-0000-000000000000',
      conservationId: '112'
    }
  },
  location: {
    pathname:
      '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/edit/112',
    state: [
      {
        objectData: {
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 28,
        uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
        museumId: 99,
        museumNo: 'MusK314',
        subNo: 'b',
        term: 'Runeskrift',
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      {
        objectData: {
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 1,
        uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '1',
        term: 'Rar dings',
        mainObjectId: 1,
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      {
        objectData: {
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 2,
        uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '2',
        term: 'Mansjettknapp',
        mainObjectId: 1,
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      {
        objectData: {
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 9,
        uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
        museumId: 99,
        museumNo: 'MusN28',
        term: 'Tusenben',
        collection: 2,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      {
        objectData: {
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        id: 8,
        uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
        museumId: 99,
        museumNo: 'MusN37',
        term: 'Bendelorm',
        collection: 2,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      }
    ],
    search: '',
    hash: '',
    key: 'nt6nc4'
  },
  history: {
    length: 48,
    action: 'PUSH',
    location: {
      pathname:
        '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/edit/112',
      state: [
        {
          objectData: {
            id: 28,
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 28,
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 1,
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 1,
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 2,
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: 1,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 2,
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: 1,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 9,
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 9,
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        },
        {
          objectData: {
            id: 8,
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: 2,
            materials: [],
            locations: [],
            coordinates: [],
            isDeleted: false,
            objectType: 'collection'
          },
          id: 8,
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: 2,
          materials: [],
          locations: [],
          coordinates: [],
          isDeleted: false,
          objectType: 'collection'
        }
      ],
      search: '',
      hash: '',
      key: 'nt6nc4'
    }
  },
  isFormValid: true,
  objects: [
    {
      objectData: {
        id: 28,
        uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
        museumId: 99,
        museumNo: 'MusK314',
        subNo: 'b',
        term: 'Runeskrift',
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 28,
      uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
      museumId: 99,
      museumNo: 'MusK314',
      subNo: 'b',
      term: 'Runeskrift',
      collection: 1,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    },
    {
      objectData: {
        id: 1,
        uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '1',
        term: 'Rar dings',
        mainObjectId: 1,
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 1,
      uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
      museumId: 99,
      museumNo: 'MusK58',
      subNo: '1',
      term: 'Rar dings',
      mainObjectId: 1,
      collection: 1,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    },
    {
      objectData: {
        id: 2,
        uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '2',
        term: 'Mansjettknapp',
        mainObjectId: 1,
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 2,
      uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
      museumId: 99,
      museumNo: 'MusK58',
      subNo: '2',
      term: 'Mansjettknapp',
      mainObjectId: 1,
      collection: 1,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    },
    {
      objectData: {
        id: 9,
        uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
        museumId: 99,
        museumNo: 'MusN28',
        term: 'Tusenben',
        collection: 2,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 9,
      uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
      museumId: 99,
      museumNo: 'MusN28',
      term: 'Tusenben',
      collection: 2,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    },
    {
      objectData: {
        id: 8,
        uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
        museumId: 99,
        museumNo: 'MusN37',
        term: 'Bendelorm',
        collection: 2,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: 'collection'
      },
      id: 8,
      uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
      museumId: 99,
      museumNo: 'MusN37',
      term: 'Bendelorm',
      collection: 2,
      materials: [],
      locations: [],
      coordinates: [],
      isDeleted: false,
      objectType: 'collection'
    }
  ],
  loadingConservation: false
};

describe('ConservationComponent edit page', () => {
  it('should render edit page properly', () => {
    const wrapper = shallow(
      <ConservationComponent
        {...editPageProps}
        updateConservationSubEvent={e => e}
        updateMultiSelectField={e => e}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});

const addPageProps: any = {
  predefinedConservation: {
    sampleTypes: {
      'DNA extract': [
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
        }
      ],
      Tissue: [
        {
          sampleTypeId: 5,
          noSampleType: 'Vev',
          enSampleType: 'Tissue',
          noSampleSubType: 'Frø',
          enSampleSubType: 'Seed'
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
        }
      ],
      'Living individual': [
        {
          sampleTypeId: 6,
          noSampleType: 'Levende individ',
          enSampleType: 'Living individual'
        }
      ],
      Parasite: [
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
        }
      ],
      'RNA library': [
        { sampleTypeId: 9, noSampleType: 'RNA-bibliotek', enSampleType: 'RNA library' }
      ],
      'RNA extract': [
        { sampleTypeId: 10, noSampleType: 'RNA-ekstrakt', enSampleType: 'RNA extract' }
      ],
      Material: [
        { sampleTypeId: 37, noSampleType: 'Materiale', enSampleType: 'Material' }
      ],
      'Archaeological material': [
        {
          sampleTypeId: 38,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'leire ',
          enSampleSubType: 'clay'
        },
        {
          sampleTypeId: 39,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lerret',
          enSampleSubType: 'canvas'
        },
        {
          sampleTypeId: 40,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lin',
          enSampleSubType: 'flax'
        },
        {
          sampleTypeId: 41,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lær',
          enSampleSubType: 'leather'
        }
      ],
      'Ethnografic material': [
        {
          sampleTypeId: 164,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'agat',
          enSampleSubType: 'agate'
        },
        {
          sampleTypeId: 165,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'akryl',
          enSampleSubType: 'acrylic'
        },
        {
          sampleTypeId: 166,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'alabast',
          enSampleSubType: 'alabaster'
        },
        {
          sampleTypeId: 167,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'ametyst',
          enSampleSubType: 'amethyst'
        }
      ],
      'Numismatic material': [
        {
          sampleTypeId: 376,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Porselen',
          enSampleSubType: 'Porcelain'
        },
        {
          sampleTypeId: 377,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Sink',
          enSampleSubType: 'Zink'
        },
        {
          sampleTypeId: 378,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Stål',
          enSampleSubType: 'Steel'
        }
      ],
      'Sediment and soil samples': [
        {
          sampleTypeId: 380,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'C/N prøver',
          enSampleSubType: 'C/N samples'
        },
        {
          sampleTypeId: 381,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Jordmikromorfologiske prøver',
          enSampleSubType: 'Soil micromorphology samples'
        },
        {
          sampleTypeId: 382,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Kornfordelingsprøver',
          enSampleSubType: 'Grain size distribution (GSD) samples'
        }
      ],
      raw: [
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
        { sampleTypeId: 10, noSampleType: 'RNA-ekstrakt', enSampleType: 'RNA extract' },
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
        { sampleTypeId: 37, noSampleType: 'Materiale', enSampleType: 'Material' },
        {
          sampleTypeId: 38,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'leire ',
          enSampleSubType: 'clay'
        },
        {
          sampleTypeId: 39,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lerret',
          enSampleSubType: 'canvas'
        },
        {
          sampleTypeId: 40,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lin',
          enSampleSubType: 'flax'
        },
        {
          sampleTypeId: 41,
          noSampleType: 'Arkeologisk materiale',
          enSampleType: 'Archaeological material',
          noSampleSubType: 'lær',
          enSampleSubType: 'leather'
        },
        {
          sampleTypeId: 164,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'agat',
          enSampleSubType: 'agate'
        },
        {
          sampleTypeId: 165,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'akryl',
          enSampleSubType: 'acrylic'
        },
        {
          sampleTypeId: 166,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'alabast',
          enSampleSubType: 'alabaster'
        },
        {
          sampleTypeId: 167,
          noSampleType: 'Etnografisk materiale',
          enSampleType: 'Ethnografic material',
          noSampleSubType: 'ametyst',
          enSampleSubType: 'amethyst'
        },
        {
          sampleTypeId: 376,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Porselen',
          enSampleSubType: 'Porcelain'
        },
        {
          sampleTypeId: 377,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Sink',
          enSampleSubType: 'Zink'
        },
        {
          sampleTypeId: 378,
          noSampleType: 'Numismatisk materiale',
          enSampleType: 'Numismatic material',
          noSampleSubType: 'Stål',
          enSampleSubType: 'Steel'
        },
        {
          sampleTypeId: 380,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'C/N prøver',
          enSampleSubType: 'C/N samples'
        },
        {
          sampleTypeId: 381,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Jordmikromorfologiske prøver',
          enSampleSubType: 'Soil micromorphology samples'
        },
        {
          sampleTypeId: 382,
          noSampleType: 'Sediment-/jordprøver',
          enSampleType: 'Sediment and soil samples',
          noSampleSubType: 'Kornfordelingsprøver',
          enSampleSubType: 'Grain size distribution (GSD) samples'
        }
      ]
    },
    loadingSampleTypes: false,
    conservationTypes: [
      {
        id: 1,
        noName: 'konserveringsprosess',
        enName: 'conservation process',
        collections: []
      },
      {
        id: 2,
        noName: 'behandling',
        enName: 'treatment',
        collections: ['ba3d4d30-810b-4c07-81b3-37751f2196f0']
      },
      {
        id: 3,
        noName: 'teknisk beskrivelse',
        enName: 'technical description',
        collections: []
      }
    ],
    loadingConservationTypes: false,
    keywordList: [
      { id: 1, noTerm: 'Støvsuget', enTerm: 'Støvsuget' },
      { id: 2, noTerm: 'Børstet', enTerm: 'Børstet' },
      { id: 3, noTerm: 'Kjemisk rensing', enTerm: 'Kjemisk rensing' },
      { id: 4, noTerm: 'Mekanisk rensing', enTerm: 'Mekanisk rensing' },
      { id: 5, noTerm: 'Utvasking', enTerm: 'Utvasking' },
      { id: 6, noTerm: 'Sandblåst', enTerm: 'Sandblåst' },
      { id: 7, noTerm: 'Limt', enTerm: 'Limt' },
      { id: 8, noTerm: 'Impregnert', enTerm: 'Impregnert' },
      { id: 9, noTerm: 'Konsolidert', enTerm: 'Konsolidert' },
      { id: 10, noTerm: 'Frysetørket', enTerm: 'Frysetørket' },
      { id: 11, noTerm: 'Retusjert', enTerm: 'Retusjert' },
      { id: 12, noTerm: 'Pakket', enTerm: 'Pakket' },
      { id: 13, noTerm: 'Lufttørket', enTerm: 'Lufttørket' },
      { id: 14, noTerm: 'Slipt (maskinelt)', enTerm: 'Slipt (maskinelt)' },
      { id: 15, noTerm: 'Avstøpning', enTerm: 'Avstøpning' },
      { id: 16, noTerm: 'Lakkert', enTerm: 'Lakkert' }
    ],
    materialList: [
      { id: 1, noTerm: 'Sitronsyre', enTerm: 'Sitronsyre' },
      { id: 2, noTerm: 'Klucel EF', enTerm: 'Klucel EF' },
      { id: 3, noTerm: 'Klucel G', enTerm: 'Klucel G' },
      {
        id: 4,
        noTerm: 'Lascaux Medium for konsolidering',
        enTerm: 'Lascaux Medium for konsolidering'
      },
      { id: 5, noTerm: 'Aceton', enTerm: 'Aceton' },
      { id: 6, noTerm: 'Rochelle salt', enTerm: 'Rochelle salt' },
      { id: 7, noTerm: 'Aluminiumsoksid', enTerm: 'Aluminiumsoksid' },
      { id: 8, noTerm: 'Ammoniakk', enTerm: 'Ammoniakk' },
      { id: 9, noTerm: 'Ammoniumhydroksid', enTerm: 'Ammoniumhydroksid' },
      { id: 10, noTerm: 'Benzen', enTerm: 'Benzen' },
      { id: 11, noTerm: 'Benzotriasol (BTA)', enTerm: 'Benzotriasol (BTA)' },
      { id: 12, noTerm: 'Cellulosenitrat', enTerm: 'Cellulosenitrat' },
      { id: 13, noTerm: 'Kolofonium', enTerm: 'Kolofonium' },
      { id: 14, noTerm: 'Cyanoakrylat (superlim)', enTerm: 'Cyanoakrylat (superlim)' },
      { id: 15, noTerm: 'Eddiksyre', enTerm: 'Eddiksyre' },
      { id: 16, noTerm: 'EDTA-Na2', enTerm: 'EDTA-Na2' },
      { id: 17, noTerm: 'EDTA', enTerm: 'EDTA' },
      { id: 18, noTerm: 'Epoxylim', enTerm: 'Epoxylim' },
      { id: 19, noTerm: 'Etanol', enTerm: 'Etanol' },
      { id: 20, noTerm: 'Smeltelim (EVA)', enTerm: 'Smeltelim (EVA)' },
      { id: 21, noTerm: 'Fosforsyre', enTerm: 'Fosforsyre' },
      { id: 22, noTerm: 'Gasil 23', enTerm: 'Gasil 23' },
      { id: 23, noTerm: 'Gips', enTerm: 'Gips' },
      { id: 24, noTerm: 'Glassfibervev', enTerm: 'Glassfibervev' },
      { id: 25, noTerm: 'Glasspulver', enTerm: 'Glasspulver' },
      { id: 26, noTerm: 'Glycerin', enTerm: 'Glycerin' },
      { id: 27, noTerm: 'Hydrogenperoksid', enTerm: 'Hydrogenperoksid' },
      { id: 28, noTerm: 'Incralac', enTerm: 'Incralac' },
      { id: 29, noTerm: 'Isopropanol', enTerm: 'Isopropanol' },
      { id: 30, noTerm: 'Japanpapir', enTerm: 'Japanpapir' },
      { id: 31, noTerm: 'Lissapol N', enTerm: 'Lissapol N' },
      { id: 32, noTerm: 'Maursyre', enTerm: 'Maursyre' },
      { id: 33, noTerm: 'Mannitol', enTerm: 'Mannitol' },
      { id: 34, noTerm: 'Mikrokrystallinsk voks', enTerm: 'Mikrokrystallinsk voks' },
      { id: 35, noTerm: 'Natriumkarbonat', enTerm: 'Natriumkarbonat' },
      { id: 36, noTerm: 'Natriumsitrat', enTerm: 'Natriumsitrat' },
      { id: 37, noTerm: 'Natriumhydrogenkarbonat', enTerm: 'Natriumhydrogenkarbonat' },
      { id: 38, noTerm: 'Natriumhydroksyd', enTerm: 'Natriumhydroksyd' },
      { id: 39, noTerm: 'Paraloid B72', enTerm: 'Paraloid B72' },
      { id: 40, noTerm: 'PEG høymolekylær (fast)', enTerm: 'PEG høymolekylær (fast)' },
      {
        id: 41,
        noTerm: 'Petroleumsether kpkt 60-80 grader',
        enTerm: 'Petroleumsether kpkt 60-80 grader'
      },
      { id: 42, noTerm: 'Plextol B500', enTerm: 'Plextol B500' },
      { id: 43, noTerm: 'Polyolefin', enTerm: 'Polyolefin' },
      { id: 44, noTerm: 'Polyvinylacetat', enTerm: 'Polyvinylacetat' },
      { id: 45, noTerm: 'Primal WS24', enTerm: 'Primal WS24' },
      { id: 46, noTerm: 'Salpetersyre', enTerm: 'Salpetersyre' },
      { id: 47, noTerm: 'Saltsyre', enTerm: 'Saltsyre' },
      { id: 48, noTerm: 'Skjellakk', enTerm: 'Skjellakk' },
      { id: 49, noTerm: 'Silikagel', enTerm: 'Silikagel' },
      { id: 50, noTerm: 'Silikonfett', enTerm: 'Silikonfett' },
      { id: 51, noTerm: 'Silikongummi', enTerm: 'Silikongummi' },
      { id: 52, noTerm: 'Silver Polish Wadding', enTerm: 'Silver Polish Wadding' },
      { id: 53, noTerm: 'Sølvnitrat', enTerm: 'Sølvnitrat' },
      { id: 54, noTerm: 'Sorbitol', enTerm: 'Sorbitol' },
      { id: 55, noTerm: 'Størlim', enTerm: 'Størlim' },
      { id: 56, noTerm: 'Svovelsyre', enTerm: 'Svovelsyre' },
      { id: 57, noTerm: 'Synocryl 9122x', enTerm: 'Synocryl 9122x' },
      { id: 58, noTerm: 'Tannin syre', enTerm: 'Tannin syre' },
      { id: 59, noTerm: 'Terpentin', enTerm: 'Terpentin' },
      { id: 60, noTerm: 'Tiourea', enTerm: 'Tiourea' },
      { id: 61, noTerm: 'Toluen', enTerm: 'Toluen' },
      { id: 62, noTerm: 'White spirit', enTerm: 'White spirit' },
      {
        id: 63,
        noTerm: 'White spirit, lavaromatisk',
        enTerm: 'White spirit, lavaromatisk'
      },
      { id: 64, noTerm: 'Vann', enTerm: 'Vann' },
      { id: 65, noTerm: 'Vann (destillert)', enTerm: 'Vann (destillert)' },
      { id: 66, noTerm: 'Vann (avionisert)', enTerm: 'Vann (avionisert)' },
      { id: 67, noTerm: 'Xylen', enTerm: 'Xylen' },
      {
        id: 68,
        noTerm: 'PEG lavmoelkylær (flytende)',
        enTerm: 'PEG lavmoelkylær (flytende)'
      },
      { id: 69, noTerm: 'Paraloid B44', enTerm: 'Paraloid B44' },
      { id: 70, noTerm: 'Paraloid B 67', enTerm: 'Paraloid B 67' },
      { id: 71, noTerm: 'Technovit 5071', enTerm: 'Technovit 5071' },
      { id: 72, noTerm: 'Natriumsulfitt', enTerm: 'Natriumsulfitt' },
      { id: 73, noTerm: 'Valnøttskall', enTerm: 'Valnøttskall' }
    ]
  },
  appSession: {
    accessToken: '7dbce915-c87a-47c1-8666-c858f3624d0d',
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
      builtAtMillis: '1511169267488',
      name: 'service_auth',
      scalaVersion: '2.11.8',
      buildInfoBuildNumber: '31',
      version: '0.1-SNAPSHOT',
      sbtVersion: '0.13.16',
      commitSha: 'not built on CI',
      builtAtString: '2017-11-20 09:14:27.488'
    },
    language: { isEn: true, isNo: false }
  },
  store: { loadingConservation: false, conservation: null },
  form: {
    id: {
      name: 'id',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    eventTypeId: {
      name: 'eventTypeId',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    doneBy: {
      name: 'doneBy',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    doneDate: {
      name: 'doneDate',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    participating: {
      name: 'participating',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    participatingName: {
      name: 'participatingName',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    persons: {
      name: 'persons',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredBy: {
      name: 'registeredBy',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredByName: {
      name: 'registeredByName',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    registeredDate: {
      name: 'registeredDate',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    note: {
      name: 'note',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    caseNumber: {
      name: 'caseNumber',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    affectedThings: {
      name: 'affectedThings',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    objects: {
      name: 'objects',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedBy: {
      name: 'updatedBy',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedByName: {
      name: 'updatedByName',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    updatedDate: {
      name: 'updatedDate',
      defaultValue: null,
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    subEventTypes: {
      name: 'subEventTypes',
      defaultValue: '',
      value: null,
      rawValue: null,
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    },
    events: {
      name: 'events',
      defaultValue: [],
      value: [],
      rawValue: [],
      mapper: {},
      validator: { rawValidator: null },
      status: { valid: true, error: null }
    }
  },
  match: {
    path: '/museum/:museumId/collections/:collectionIds/conservation/add',
    url: '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/add',
    isExact: true,
    params: { museumId: '99', collectionIds: '00000000-0000-0000-0000-000000000000' }
  },
  location: {
    pathname:
      '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/add',
    state: [
      {
        id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
        museumId: 99,
        museumNo: 'MusK314',
        subNo: 'b',
        term: 'Runeskrift',
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
        objectData: {
          id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb'
        }
      },
      {
        id: 'ad1b5287-0168-4343-b3df-a477de113bee',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '1',
        term: 'Rar dings',
        mainObjectId: 1,
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
        objectData: {
          id: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee'
        }
      },
      {
        id: 'adea8141-8099-4f67-bff9-ea5090e18335',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '2',
        term: 'Mansjettknapp',
        mainObjectId: 1,
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
        objectData: {
          id: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
        }
      },
      {
        id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
        museumId: 99,
        museumNo: 'MusN28',
        term: 'Tusenben',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
        objectData: {
          id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b'
        }
      },
      {
        id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
        museumId: 99,
        museumNo: 'MusN32',
        term: 'Museskjelett',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56',
        objectData: {
          id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
          museumId: 99,
          museumNo: 'MusN32',
          term: 'Museskjelett',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56'
        }
      },
      {
        id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
        museumId: 99,
        museumNo: 'MusN37',
        term: 'Bendelorm',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
        objectData: {
          id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf'
        }
      }
    ],
    search: '',
    hash: '',
    key: 'm07t50'
  },
  history: {
    length: 50,
    action: 'PUSH',
    location: {
      pathname:
        '/museum/99/collections/00000000-0000-0000-0000-000000000000/conservation/add',
      state: [
        {
          id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          museumId: 99,
          museumNo: 'MusK314',
          subNo: 'b',
          term: 'Runeskrift',
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
          objectData: {
            id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
            museumId: 99,
            museumNo: 'MusK314',
            subNo: 'b',
            term: 'Runeskrift',
            collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
            isDeleted: false,
            objectType: 'collection',
            uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb'
          }
        },
        {
          id: 'ad1b5287-0168-4343-b3df-a477de113bee',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '1',
          term: 'Rar dings',
          mainObjectId: 1,
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
          objectData: {
            id: 'ad1b5287-0168-4343-b3df-a477de113bee',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '1',
            term: 'Rar dings',
            mainObjectId: 1,
            collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
            isDeleted: false,
            objectType: 'collection',
            uuid: 'ad1b5287-0168-4343-b3df-a477de113bee'
          }
        },
        {
          id: 'adea8141-8099-4f67-bff9-ea5090e18335',
          museumId: 99,
          museumNo: 'MusK58',
          subNo: '2',
          term: 'Mansjettknapp',
          mainObjectId: 1,
          collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
          isDeleted: false,
          objectType: 'collection',
          uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
          objectData: {
            id: 'adea8141-8099-4f67-bff9-ea5090e18335',
            museumId: 99,
            museumNo: 'MusK58',
            subNo: '2',
            term: 'Mansjettknapp',
            mainObjectId: 1,
            collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
            isDeleted: false,
            objectType: 'collection',
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
          }
        },
        {
          id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          museumId: 99,
          museumNo: 'MusN28',
          term: 'Tusenben',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
          objectData: {
            id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
            museumId: 99,
            museumNo: 'MusN28',
            term: 'Tusenben',
            collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
            isDeleted: false,
            objectType: 'collection',
            uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b'
          }
        },
        {
          id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
          museumId: 99,
          museumNo: 'MusN32',
          term: 'Museskjelett',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56',
          objectData: {
            id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
            museumId: 99,
            museumNo: 'MusN32',
            term: 'Museskjelett',
            collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
            isDeleted: false,
            objectType: 'collection',
            uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56'
          }
        },
        {
          id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          museumId: 99,
          museumNo: 'MusN37',
          term: 'Bendelorm',
          collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
          isDeleted: false,
          objectType: 'collection',
          uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
          objectData: {
            id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
            museumId: 99,
            museumNo: 'MusN37',
            term: 'Bendelorm',
            collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
            isDeleted: false,
            objectType: 'collection',
            uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf'
          }
        }
      ],
      search: '',
      hash: '',
      key: 'm07t50'
    }
  },
  isFormValid: true,
  objects: [
    {
      id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
      museumId: 99,
      museumNo: 'MusK314',
      subNo: 'b',
      term: 'Runeskrift',
      collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
      isDeleted: false,
      objectType: 'collection',
      uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
      objectData: {
        id: 'ba56a4f6-b907-4158-9a67-bca6080320bb',
        museumId: 99,
        museumNo: 'MusK314',
        subNo: 'b',
        term: 'Runeskrift',
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'ba56a4f6-b907-4158-9a67-bca6080320bb'
      }
    },
    {
      id: 'ad1b5287-0168-4343-b3df-a477de113bee',
      museumId: 99,
      museumNo: 'MusK58',
      subNo: '1',
      term: 'Rar dings',
      mainObjectId: 1,
      collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
      isDeleted: false,
      objectType: 'collection',
      uuid: 'ad1b5287-0168-4343-b3df-a477de113bee',
      objectData: {
        id: 'ad1b5287-0168-4343-b3df-a477de113bee',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '1',
        term: 'Rar dings',
        mainObjectId: 1,
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'ad1b5287-0168-4343-b3df-a477de113bee'
      }
    },
    {
      id: 'adea8141-8099-4f67-bff9-ea5090e18335',
      museumId: 99,
      museumNo: 'MusK58',
      subNo: '2',
      term: 'Mansjettknapp',
      mainObjectId: 1,
      collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
      isDeleted: false,
      objectType: 'collection',
      uuid: 'adea8141-8099-4f67-bff9-ea5090e18335',
      objectData: {
        id: 'adea8141-8099-4f67-bff9-ea5090e18335',
        museumId: 99,
        museumNo: 'MusK58',
        subNo: '2',
        term: 'Mansjettknapp',
        mainObjectId: 1,
        collection: { id: 1, uuid: '2e4f2455-1b3b-4a04-80a1-ba92715ff613' },
        isDeleted: false,
        objectType: 'collection',
        uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
      }
    },
    {
      id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
      museumId: 99,
      museumNo: 'MusN28',
      term: 'Tusenben',
      collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
      isDeleted: false,
      objectType: 'collection',
      uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
      objectData: {
        id: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b',
        museumId: 99,
        museumNo: 'MusN28',
        term: 'Tusenben',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '1c9c91f5-127a-4baf-8c0e-ed37d53f944b'
      }
    },
    {
      id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
      museumId: 99,
      museumNo: 'MusN32',
      term: 'Museskjelett',
      collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
      isDeleted: false,
      objectType: 'collection',
      uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56',
      objectData: {
        id: '3dc0ab82-fa0f-415f-a558-92432106fa56',
        museumId: 99,
        museumNo: 'MusN32',
        term: 'Museskjelett',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '3dc0ab82-fa0f-415f-a558-92432106fa56'
      }
    },
    {
      id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
      museumId: 99,
      museumNo: 'MusN37',
      term: 'Bendelorm',
      collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
      isDeleted: false,
      objectType: 'collection',
      uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf',
      objectData: {
        id: '41be3c71-a71b-486d-a265-c3a92672f4cf',
        museumId: 99,
        museumNo: 'MusN37',
        term: 'Bendelorm',
        collection: { id: 2, uuid: '88b35138-24b5-4e62-bae4-de80fae7df82' },
        isDeleted: false,
        objectType: 'collection',
        uuid: '41be3c71-a71b-486d-a265-c3a92672f4cf'
      }
    }
  ],
  loadingConservation: false
};

describe('ConservationComponent add page', () => {
  it('should render add page properly', () => {
    const wrapper = shallow(
      <ConservationComponent {...addPageProps} updateMultiSelectField={e => e} />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
