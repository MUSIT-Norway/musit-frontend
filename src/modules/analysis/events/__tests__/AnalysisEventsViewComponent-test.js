// @flow
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import AnalysisEventTableComponent from '../AnalysisEventsTableComponent';
import AnalysisEventsViewComponent from '../AnalysisEventsViewComponent';

describe('AnalysisEventsViewComponent', () => {
  it('should render AnalysisEventTableComponent when store is loaded', () => {
    const appSession = sinon.spy();
    const goToAnalysis = sinon.spy();
    const filterEvents = sinon.spy();

    const Component = mount(
      <AnalysisEventsViewComponent
        analysisEventsStore={{
          loading: false,
          analysisEvents: [],
          analysisEventsFiltered: [],
          filterEventValue: ''
        }}
        goToAnalysis={goToAnalysis}
        appSession={appSession}
        filterEvents={filterEvents}
      />
    );

    expect(Component.find(AnalysisEventTableComponent).length).toBe(1);
  });

  it('should not render AnalysisEventTableComponent when store is not done loading', () => {
    const appSession = sinon.spy();
    const goToAnalysis = sinon.spy();
    const filterEvents = sinon.spy();

    const Component = mount(
      <AnalysisEventsViewComponent
        analysisEventsStore={{
          loading: true,
          analysisEvents: [],
          analysisEventsFiltered: [],
          filterEventValue: ''
        }}
        goToAnalysis={goToAnalysis}
        appSession={appSession}
        filterEvents={filterEvents}
      />
    );

    expect(Component.find(AnalysisEventTableComponent).length).toBe(0);
  });

  it('should notify store when filter events changes', () => {
    const filterValue = 'FilterOnMe';
    const appSession = sinon.spy();
    const goToAnalysis = sinon.spy();
    const filterEvents = sinon.spy();

    const Component = mount(
      <AnalysisEventsViewComponent
        analysisEventsStore={{
          loading: false,
          analysisEvents: [],
          analysisEventsFiltered: [],
          filterEventValue: ''
        }}
        goToAnalysis={goToAnalysis}
        appSession={appSession}
        filterEvents={filterEvents}
      />
    );

    onInputChange(Component.find('#filter-analysis-events'), filterValue);

    expect(filterEvents.calledWith(filterValue)).toBe(true);
  });

  const onInputChange = (comp: *, value: string) => {
    comp.simulate('change', { target: { value } });
  };
});
