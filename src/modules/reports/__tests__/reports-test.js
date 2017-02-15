import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ReportsOverview from '../ReportsOverview';
import { KDReport } from '../KDReportComponent';
import sinon from 'sinon';

describe('Reports overview', () => {
  it('should display correctly', () => {
    const wrapper = shallow(<ReportsOverview />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});

describe('KDReportComponent', () => {
  it('should display correctly', () => {
    const clear = sinon.spy();
    const loadKDReport = sinon.spy();
    const wrapper = shallow(<KDReport
      store={{
        data: {
          kdreport: {
            totalArea: 1.23,
            perimeterSecurity: 23.34,
            theftProtection: 234.2,
            fireProtection: 34.3,
            waterDamageAssessment: 234.3,
            routinesAndContingencyPlan: 2334.3
          }
        }
      }}
      appSession={{ getMuseumId: () => 1, getAccessToken: () => 'xxxx-xxxx-xxxx-xxxx' }}
      loadKDReport={loadKDReport}
      clear={clear}
    />);
    expect(clear.callCount).toBe(1);
    expect(loadKDReport.callCount).toBe(1);
    expect(loadKDReport.getCall(0).args[0].token).toBe('xxxx-xxxx-xxxx-xxxx');
    expect(loadKDReport.getCall(0).args[0].museumId).toBe(1);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});