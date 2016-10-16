import { shallow } from 'enzyme'
import React from 'react'
import ReportsOverview from '../index'

describe('Reports overview', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ReportsOverview />)
  })

  it('should display link to KD report', () => {
    expect(wrapper.contains(
      <td>
        <a href={'/#/reports/kdreport'}>
          Title
        </a>
      </td>
    )).toEqual(true)
  })

  it('should display description of report', () => {
    expect(wrapper.contains(
      <td>
        Description
      </td>
    )).toEqual(true)
  })
})
