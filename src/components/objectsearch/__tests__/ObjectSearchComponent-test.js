import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import ObjectSearchComponent from '../ObjectSearchComponent'
import { renderBreadcrumb } from '../ObjectSearchComponent'

describe('ObjectSearchComponent', () => {
  const testData = {
    totalMatches: 20,
    matches: Array(20).fill(
      {
        museumNo: '12345',
        subNo: '45',
        term: 'Fuglekasse',
        id: 1,
        path: ',1,2,3,',
        pathNames: [
          {
            nodeId: 1,
            name: "Root",
            type: "Organization"
          },
          {
            nodeId: 2,
            name: "Musit",
            type: "Building"
          },
          {
            nodeId: 3,
            name: "Kontoret",
            type: "Room"
          }
        ]
      }
    )
  }

  it('should display object 1', () => {
    const wrapper = shallow(
      <ObjectSearchComponent
        location={{
          query: {
            page: '1'
          },
          pathname: '/#/search/objects'
        }}
        data={testData}
        onChangeField={() => true}
        params={{
          museumNo: "1234",
          subNo: "455",
          term: "Lololol",
          currentPage: 1
        }}
      />
    )
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('should display breadcrumb correctly', () => {
    const path = ',1,2,3,'
    const pathNames = [
      {
        nodeId: 1,
        name: "Root",
        type: "Organization"
      },
      {
        nodeId: 2,
        name: "Musit",
        type: "Building"
      },
      {
        nodeId: 3,
        name: "Kontoret",
        type: "Room"
      }
    ]
    const wrapper = shallow(renderBreadcrumb(path, pathNames))
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
