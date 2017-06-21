import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ViewObjectComponent from '../ViewObjectComponent';
import ViewOjectData from '../components/ViewObjectData';

describe('ViewObjectComponent', () => {
  it('should not display component if loading', () => {
    const wrapper = shallow(
      <ViewObjectComponent
        loading={true}
        objectStore={{
          objectData: {
            uuid: '22233-4443-222-333',
            museumNo: 'O-L-3444',
            objectType: 'Collection',
            currentLocation: { pathNames: [] }
          },
          events: [
            {
              eventDate: '1999-01-20',
              eventType: 'Flytting',
              registeredBy: 'Ole Olsen',
              keyData: 'Til magasin nr 3',
              note: 'Ein kommentar',
              id: '1233-111-2222-222'
            },
            {
              eventDate: '1999-06-20',
              eventType: 'Analyse',
              registeredBy: 'Ole Hansen',
              keyData: 'Acid',
              note: 'Ein kommentar',
              id: '1233-111-2122-222'
            }
          ],
          samples: [
            {
              doneDate: '1999-01-20',
              sampleTypeId: 1,
              status: 2,
              hasAnalyse: false,
              id: '1233-111-2222-222'
            },
            {
              doneDate: '1999-01-29',
              sampleTypeId: 2,
              status: 24,
              hasAnalyse: true,
              id: '1233-111-2155-222'
            }
          ]
        }}
      />
    );
    expect(wrapper.find('div.loading').length).toBe(1);
    expect(wrapper.find('div.container').length).toBe(0);
  });

  it('should display component if not loading', () => {
    const wrapper = shallow(
      <ViewObjectComponent
        loading={false}
        objectStore={{
          objectData: {
            uuid: '22233-4443-222-333',
            museumNo: 'O-L-3444',
            objectType: 'Collection',
            currentLocation: { pathNames: [] }
          },
          events: [
            {
              eventDate: '1999-01-20',
              eventType: 'Flytting',
              registeredBy: 'Ole Olsen',
              keyData: 'Til magasin nr 3',
              note: 'Ein kommentar',
              id: '1233-111-2222-222'
            },
            {
              eventDate: '1999-06-20',
              eventType: 'Analyse',
              registeredBy: 'Ole Hansen',
              keyData: 'Acid',
              note: 'Ein kommentar',
              id: '1233-111-2122-222'
            }
          ],
          samples: [
            {
              doneDate: '1999-01-20',
              sampleTypeId: 1,
              status: 2,
              hasAnalyse: false,
              id: '1233-111-2222-222'
            },
            {
              doneDate: '1999-01-29',
              sampleTypeId: 2,
              status: 24,
              hasAnalyse: true,
              id: '1233-111-2155-222'
            }
          ]
        }}
      />
    );
    expect(wrapper.find('div.loading').length).toBe(0);
    expect(wrapper.find('div.container').length).toBe(1);
  });

  it('should display the objectViewerComponent', () => {
    const wrapper = shallow(
      <ViewObjectComponent
        loading={false}
        objectStore={{
          objectData: {
            uuid: '22233-4443-222-333',
            museumNo: 'O-L-3444',
            objectType: 'Collection',
            collection: 5,
            currentLocation: { pathNames: [] }
          },
          events: [
            {
              eventDate: '1999-01-20',
              eventType: 'Flytting',
              registeredBy: 'Ole Olsen',
              keyData: 'Til magasin nr 3',
              note: 'Ein kommentar',
              id: '1233-111-2222-222'
            },
            {
              eventDate: '1999-06-20',
              eventType: 'Analyse',
              registeredBy: 'Ole Hansen',
              keyData: 'Acid',
              note: 'Ein kommentar',
              id: '1233-111-2122-222'
            }
          ],
          samples: [
            {
              doneDate: '1999-01-20',
              sampleTypeId: 1,
              status: 2,
              hasAnalyse: false,
              id: '1233-111-2222-222'
            },
            {
              doneDate: '1999-01-29',
              sampleTypeId: 2,
              status: 24,
              hasAnalyse: false,
              id: '1233-111-2155-222'
            }
          ]
        }}
      />
    );
    expect(wrapper.find('div.container').find('component').length).toBe(1);
  });

  it('should display nathist-component if collection=5 (one of nathist)', () => {
    const wrapper = shallow(
      <ViewOjectData
        objectData={{
          uuid: '22233-4443-222-333',
          museumNo: 'O-L-3444',
          objectType: 'Collection',
          collection: 5,
          currentLocation: { pathNames: [] }
        }}
      />
    );
    expect(wrapper.find('div.Nathist').length).toBe(1);
  });

  it('should display ark-component if collection=1 (one of ark)', () => {
    const wrapper = shallow(
      <ViewOjectData
        objectData={{
          uuid: '22233-4443-222-333',
          museumNo: 'ARK-L-3444',
          objectType: 'Collection',
          materials: [],
          locations: [],
          coordinates: [],
          collection: 1,
          currentLocation: { pathNames: [] }
        }}
      />
    );
    expect(wrapper.find('div.Ark').length).toBe(1);
  });

  it('should display unknown-component if collection is illegal (none of ark, nat, etno, numis)', () => {
    const wrapper = shallow(
      <ViewOjectData
        objectData={{
          uuid: '22233-4443-222-333',
          museumNo: 'till-L-3444',
          objectType: 'Collection',
          materials: [],
          locations: [],
          coordinates: [],
          collection: 112343,
          currentLocation: { pathNames: [] }
        }}
      />
    );
    expect(wrapper.find('div.unknown').length).toBe(1);
  });
});
