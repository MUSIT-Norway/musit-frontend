import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import ObjectSearchComponent from '../ObjectSearchComponent'

describe('ObjectSearchComponent', () => {
  const testData = [
    {
      museumNo: '12345',
      subNo: '45',
      term: 'Fuglekasse',
      id: 1
    },
    {
      museumNo: '12',
      subNo: '46',
      term: 'Stol',
      id: 2
    },
    {
      museumNo: '123',
      subNo: '48',
      term: 'Kasse',
      id: 3
    }
  ]

  it('should display object 1', () => {
    const wrapper = shallow(
      <ObjectSearchComponent
        data={testData}
        museumNo="1234"
        onChangeMuseumNo={() => true}
        subNo="455"
        onChangeSubNo={() => true}
        term="Lololol"
        onChangeTerm={() => true}
      />
    )
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
