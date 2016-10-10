import { render } from 'enzyme'
import React from 'react'
import ReportsOverview from '../index'

describe('Reports overview', () => {
  it('should display KD report', () => {
    const report = render(<ReportsOverview />)
    const a = report.find('td > a')
    expect(a.attr('href')).to.equal('/#/reports/kdreport')
    expect(a.text()).to.equal('Sikring av samlinger')
  })
})
