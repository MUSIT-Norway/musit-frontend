// @flow
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AnalysisEventTableComponent from '../AnalysisEventsTableComponent';
import type { AnalysisCollectionExtended } from '../analysisEventsStore';
import { I18n } from 'react-i18nify';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('AnalysisEventTableComponent', () => {
  const language = { isEn: true, isNo: false };

  const analysisEvent = (id: number): AnalysisCollectionExtended => ({
    id: id,
    analysisTypeId: 12,
    analysisType: {
      id: 12,
      enName: 'enName',
      noName: 'noName',
      category: '12',
      name: '12'
    },
    registeredDate: '2017-02-09T09:52:26+00:00',
    registeredBy: '00000-0000-000',
    registeredByName: 'Ola Normann',
    status: 3,
    events: []
  });

  it('should render table without any data', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(Comp.find('thead tr').length).toBe(1);
    expect(Comp.find('tbody tr').length).toBe(0);
  });

  it('should render table with an element', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(Comp.find('thead tr').length).toBe(1);
    expect(Comp.find('tbody tr').length).toBe(1);
  });

  it('should render table with an element', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(1), analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(Comp.find('thead tr').length).toBe(1);
    expect(Comp.find('tbody tr').length).toBe(2);
  });

  it('should render status with text', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(
      Comp.find('td')
        .at(2)
        .text()
    ).toBe(I18n.t('musit.analysis.statusType.3'));
  });

  it('should render status as empty if absent', () => {
    const event: AnalysisCollectionExtended = { id: 12, analysisTypeId: 12, events: [] };
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[event]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(
      Comp.find('td')
        .at(2)
        .text()
    ).toBe('');
  });

  it('should render formatted registered date', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(
      Comp.find('td')
        .first()
        .text()
    ).toBe('09.02.2017');
  });

  it('should render analysis type based on language (en)', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    expect(
      Comp.find('td')
        .at(1)
        .text()
    ).toBe('enName');
  });

  it('should call onRowClicked with analysisId', () => {
    const onClick = sinon.spy();
    const Comp = shallow(
      <AnalysisEventTableComponent
        events={[analysisEvent(2)]}
        onRowClicked={onClick}
        language={language}
      />
    );

    Comp.find('tbody tr').simulate('click');

    expect(onClick.calledOnce).toBe(true);
    expect(onClick.calledWith(2)).toBe(true);
  });
});
