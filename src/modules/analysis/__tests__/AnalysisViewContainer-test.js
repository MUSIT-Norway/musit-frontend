import React from 'react';
import { onMount, onReceiveProps, props } from '../AnalysisViewContainer';
import { onUnmount } from '../shared/formProps';
import { fieldsArray } from '../analysisForm';
import sinon from 'sinon';
import { appSession, analysis } from '../../../testutils/sampleDataForTest';

describe('AnalysisViewContainer', () => {
  describe('onMount', () => {
    it('should call setLoading and getAnalysis', () => {
      const getAnalysis = sinon.spy();
      const params = { analysisId: 2 };
      const predefined = { sampleTypes: {} };
      const props = {
        getAnalysis,
        match: { params },
        appSession,
        predefined
      };
      onMount(props);
      expect(getAnalysis.calledOnce).toBe(true);
      expect(getAnalysis.getCall(0).args[0].museumId).toEqual(99);
      expect(getAnalysis.getCall(0).args[0].collectionId).toEqual('1234');
      expect(getAnalysis.getCall(0).args[0].token).toEqual('45667');
    });
  });

  describe('onUnmount', () => {
    it('should call clearForm and clearStore', () => {
      const clearForm = sinon.spy();
      const clearStore = sinon.spy();
      onUnmount({ clearForm, clearStore });
      expect(clearForm.calledOnce).toBe(true);
      expect(clearStore.calledOnce).toBe(true);
    });
  });

  describe('props', () => {
    it('should work with no analysis loaded', () => {
      const form = {
        reason: { value: null },
        analysisTypeId: { value: null },
        status: { value: null },
        orgId: { value: null },
        type: { value: 'AnalysisCollection' },
        events: []
      };
      const push = sinon.spy();
      const params = { analysisId: 2 };
      const store = {};
      const predefined = {};
      const p = {
        form,
        store,
        appSession,
        predefined
      };
      const u = {
        history: { push },
        match: { params }
      };
      const viewProps = props(p, u);
      expect(viewProps.clickEdit).not.toBe(null);
      viewProps.clickEdit();
      expect(push.getCall(0).args[0]).toEqual(
        '/museum/99/collections/1234/analysis/edit/2'
      );
      expect(viewProps.objects).not.toBe(null);
      expect(viewProps.labPlaceText).toEqual('');
      expect(viewProps.statusText).toEqual('');
      expect(viewProps.analysisTypeTerm).toEqual('');
      expect(viewProps.analysisPurpose).toEqual('');
      expect(viewProps.extraDescriptionAttributes).not.toBe([]);
      expect(viewProps.extraResultAttributes).not.toBe([]);
    });
  });

  describe('onReceiveProps', () => {
    it('should call loadForm with populated form', () => {
      const loadForm = sinon.spy();
      const form = { analysisTypeId: { value: null } };
      onReceiveProps(fieldsArray)({ loadForm, form, store: { analysis } });
      expect(loadForm.calledOnce).toBe(true);
      expect(loadForm.getCall(0).args[0]).toEqual([
        { name: 'id', defaultValue: 2 },
        { name: 'analysisTypeId', defaultValue: 1 },
        { name: 'doneBy', defaultValue: undefined },
        { name: 'doneDate', defaultValue: undefined },
        { name: 'persons', defaultValue: [] },
        { name: 'registeredBy', defaultValue: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e' },
        { name: 'registeredByName', defaultValue: 'Rituvesh Kumar' },
        {
          name: 'registeredDate',
          defaultValue: '2017-04-03T10:36:34+00:00'
        },
        { name: 'responsible', defaultValue: undefined },
        { name: 'administrator', defaultValue: undefined },
        { name: 'completedBy', defaultValue: undefined },
        { name: 'completedDate', defaultValue: undefined },
        {
          name: 'objectId',
          defaultValue: 'adea8141-8099-4f67-bff9-ea5090e18335'
        },
        { name: 'note', defaultValue: 'fdsfsd sdsa 2' },
        {
          name: 'type',
          defaultValue: 'Analysis'
        },
        {
          name: 'partOf',
          defaultValue: 1
        },
        { name: 'result', defaultValue: undefined },
        { name: 'orgId', defaultValue: undefined },
        { name: 'reason', defaultValue: undefined },
        { name: 'externalSource', defaultValue: undefined },
        { name: 'comments', defaultValue: undefined },
        {
          name: 'restrictions',
          defaultValue: false
        },
        { name: 'restriction', defaultValue: null },
        { name: 'caseNumbers', defaultValue: undefined },
        { name: 'completeAnalysis', defaultValue: undefined },
        {
          name: 'museumNo',
          defaultValue: 'MusK58'
        },
        { name: 'subNo', defaultValue: '2' },
        {
          name: 'term',
          defaultValue: 'Mansjettknapp'
        },
        { name: 'events', defaultValue: [] },
        { name: 'analysisTypeCategory', defaultValue: undefined },
        { name: 'updatedBy', defaultValue: undefined },
        { name: 'updatedByName', defaultValue: undefined },
        { name: 'updatedDate', defaultValue: undefined },
        { name: 'status', defaultValue: undefined }
      ]);
    });
  });
});
