// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import Treatment from '../treatment';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const props: any = {
  name: 'treatment_0',
  affectedThingsWithDetailsMainEvent: [
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
    }
  ],
  materials: [
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
  ],
  keywords: [
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
  treatment: {
    keywords: [1],
    materials: [2],
    note: 'test',
    affectedThings: ['ad1b5287-0168-4343-b3df-a477de113bee']
  },
  index: 0,
  appSession: {
    accessToken: '123',
    actor: {
      fn: 'Rituvesh Kumar'
    },
    groups: [
      {
        id: 99,
        shortName: 'Test',
        museumId: 99,
        museumName: 'Test',
        permission: 10000,
        collections: [{ uuid: '00000000-0000-0000-0000-000000000000', name: 'All' }]
      }
    ],
    museumId: 99,
    collectionId: '00000000-0000-0000-0000-000000000000',
    buildInfo: {
      commitSha: 'not built on CI'
    },
    language: { isEn: true, isNo: false }
  },
  viewMode: true
};

describe('Treatment', () => {
  it('should render properly', () => {
    const wrapper = shallow(<Treatment {...props} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
