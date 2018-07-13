// @flow
import React from 'react';
import AnalysisFormComponent from '../AnalysisFormComponent';
import { getAnalysisTypeTerm } from '../shared/getters';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { appSession, analysisForm, history } from '../../../testutils/sampleDataForTest';

const identity = function<T>(i: T): T {
  return i;
};

describe('AnalysisFormComponent', () => {
  describe('getAnalysisTypeTerm', () => {
    it('should return empty string if not found', () => {
      const analysis = { id: 1, analysisTypeId: 11134, events: [] };
      const analysisTypes = [
        {
          id: 19934,
          name: 'Tjokkimokki 2',
          enName: 'Tjokkimokki 2',
          noName: 'Tjokkimokki 2',
          category: '5'
        },
        {
          id: 18834,
          name: 'Tjokkimokki 3',
          enName: 'Tjokkimokki 3',
          noName: 'Tjokkimokki 3',
          category: '5'
        },
        {
          id: 12234,
          name: 'Tjokkimokki 1',
          enName: 'Tjokkimokki 1',
          noName: 'Tjokkimokki 1',
          category: '5'
        }
      ];
      const term = getAnalysisTypeTerm(
        analysis.analysisTypeId,
        analysisTypes,
        appSession.language
      );
      expect(term).toBe('');
    });

    it('should return empty string if called prematurely', () => {
      const term = getAnalysisTypeTerm(undefined, [], appSession.language);
      expect(term).toBe('');
    });

    it('should match analysisTypeId with matching analysisType name', () => {
      const analysis = { id: 1, analysisTypeId: 12234, events: [] };
      const analysisTypes = [
        {
          id: 19934,
          name: 'Tjokkimokki 2',
          enName: 'Tjokkimokki 2',
          noName: 'Tjokkimokki 2',
          category: '5'
        },
        {
          id: 18834,
          name: 'Tjokkimokki 3',
          enName: 'Tjokkimokki 3',
          noName: 'Tjokkimokki 3',
          category: '5'
        },
        {
          id: 12234,
          name: 'Tjokkimokki 1',
          enName: 'Tjokkimokki 1',
          noName: 'Tjokkimokki 1',
          category: '5'
        }
      ];
      const term = getAnalysisTypeTerm(
        analysis.analysisTypeId,
        analysisTypes,
        appSession.language
      );
      expect(term).toBe('Tjokkimokki 1');
    });
  });

  it('should render objects from events', () => {
    const location = {};
    const store = {
      showCancelDialog: false,
      analysis: {
        id: 1234,
        analysisTypeId: 1234,
        events: [
          {
            id: 1,
            type: 'Analysis',
            analysisTypeId: 1,
            doneBy: '1',
            doneDate: '1',
            partOf: 23,
            registeredBy: '1',
            registeredDate: '1',
            responsible: '1',
            affectedType: 'collection',
            affectedThing: 'sdffsdsfsf',
            objectData: {
              id: 234,
              museumId: 99,
              objectType: 'collection',
              uuid: 'sdffsdsfsf',
              term: 'saks 1',
              museumNo: 'museumNO',
              subNo: 'subNO',
              mainObjectId: 1,
              nodeId: '1234'
            }
          },
          {
            id: 2,
            type: 'Analysis',
            analysisTypeId: 1,
            doneBy: '1',
            doneDate: '1',
            partOf: 23,
            registeredBy: '1',
            registeredDate: '1',
            responsible: '1',
            affectedType: 'collection',
            affectedThing: 'sdffsdsfsf',
            objectData: {
              id: 234,
              museumId: 99,
              objectType: 'collection',
              uuid: 'sdffsdsfsf',
              term: 'saks 1',
              museumNo: 'museumNO',
              subNo: 'subNO',
              mainObjectId: 1,
              nodeId: '1234'
            }
          }
        ]
      }
    };

    const wrapper = shallow(
      <AnalysisFormComponent
        extraDescriptionAttributes={[
          {
            attributeType: 'lala',
            attributeKey: 'method'
          }
        ]}
        analysisTypeTerm={''}
        getExtraDescriptionAttributeValue={() => 'test'}
        appSession={appSession}
        form={analysisForm}
        history={history}
        isFormValid={true}
        isRestrictionValidForCancellation={false}
        loadingAnalysis={false}
        objects={[]}
        extraResultAttributes={null}
        updateAnalysisCategory={identity}
        updateAnalysisTypeId={identity}
        updateExtraResultAttribute={identity}
        updateForm={identity}
        clickCancel={identity}
        toggleCancelDialog={identity}
        updateStringField={identity}
        updateArrayField={identity}
        updateBooleanField={identity}
        updateExtraDescriptionAttribute={identity}
        clickSave={identity}
        store={store}
        predefined={{
          storageMediums: [],
          storageContainers: [],
          treatments: [],
          sampleTypes: null,
          analysisLabList: [
            {
              id: 1,
              fullName: 'Kokko'
            },
            {
              id: 2,
              fullName: 'Kokkosbolle'
            }
          ],
          purposes: [
            {
              id: 1,
              enPurpose: 'mål 1',
              noPurpose: 'mål mål'
            }
          ],
          analysisTypes: [
            {
              id: 4,
              name: 'Tull',
              enName: 'Tull',
              noName: 'Tullball',
              category: '5'
            },
            {
              id: 3,
              name: 'Tull2',
              enName: 'Tull2',
              noName: 'Tullball2',
              category: '5'
            }
          ],
          categories: {
            lolol: 'lolol',
            lalala: 'lalala',
            raw: [{ id: 1, name: 'lolol' }, { id: 2, name: 'lalala' }]
          }
        }}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
