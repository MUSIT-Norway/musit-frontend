import { render } from 'enzyme'
import React from 'react'
import ReportsOverview from '../index'

describe('Reports overview', () => {
  it('should display KD report', () => {
    const report = render(<ReportsOverview />)
    const a = report.find('td > a')
    chai.expect(a.attr('href')).to.equal('/#/reports/kdreport')
    chai.expect(a.text()).to.equal('Title')
  })
})
