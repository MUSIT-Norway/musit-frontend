import React from "react";
import { onMount, onReceiveProps, props } from "../AnalysisViewContainer";
import { onUnmount } from "../shared/formProps";
import { fieldsArray } from "../analysisForm";
import sinon from "sinon";
import { appSession, analysis } from "../../../testutils/sampleDataForTest";

describe("AnalysisViewContainer", () => {
  describe("onMount", () => {
    it("should call setLoading and getAnalysis", () => {
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
      expect(getAnalysis.getCall(0).args[0].collectionId).toEqual("1234");
      expect(getAnalysis.getCall(0).args[0].token).toEqual("45667");
    });
  });

  describe("onUnmount", () => {
    it("should call clearForm and clearStore", () => {
      const clearForm = sinon.spy();
      const clearStore = sinon.spy();
      onUnmount({ clearForm, clearStore });
      expect(clearForm.calledOnce).toBe(true);
      expect(clearStore.calledOnce).toBe(true);
    });
  });

  describe("props", () => {
    it("should work with no analysis loaded", () => {
      const form = {
        reason: { value: null },
        analysisTypeId: { value: null },
        status: { value: null },
        orgId: { value: null },
        type: { value: "AnalysisCollection" },
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
      expect(push.getCall(0).args[0]).toEqual("/museum/99/collections/1234/analysis/edit/2");
      expect(viewProps.objects).not.toBe(null);
      expect(viewProps.labPlaceText).toEqual("");
      expect(viewProps.statusText).toEqual("");
      expect(viewProps.analysisTypeTerm).toEqual("");
      expect(viewProps.analysisPurpose).toEqual("");
      expect(viewProps.extraDescriptionAttributes).not.toBe([]);
      expect(viewProps.extraResultAttributes).not.toBe([]);
    });
  });

  describe("onReceiveProps", () => {
    it("should call loadForm with populated form", () => {
      const loadForm = sinon.spy();
      const form = { analysisTypeId: { value: null } };
      onReceiveProps(fieldsArray)({ loadForm, form, store: { analysis } });
      expect(loadForm.calledOnce).toBe(true);
      expect(loadForm.getCall(0).args[0]).toEqual([
        { defaultValue: 1, name: "id" },
        { defaultValue: 27, name: "analysisTypeId" },
        { defaultValue: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e", name: "doneBy" },
        { defaultValue: "2018-06-12T11:13:19+00:00", name: "doneDate" },
        {
          defaultValue: [
            {
              date: "2018-06-12T11:13:19+00:00",
              name: "Rituvesh Kumar",
              role: "doneBy",
              uuid: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
            },
            {
              date: null,
              name: "Rituvesh Kumar",
              role: "responsible",
              uuid: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
            },
            {
              date: null,
              name: "Rituvesh Kumar",
              role: "administrator",
              uuid: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
            },
            {
              date: "2018-06-12T11:13:43+00:00",
              name: "Rituvesh Kumar",
              role: "completedBy",
              uuid: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
            }
          ],
          name: "persons"
        },
        { defaultValue: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e", name: "registeredBy" },
        { defaultValue: "Rituvesh Kumar", name: "registeredByName" },
        { defaultValue: "2018-06-12T11:14:43+00:00", name: "registeredDate" },
        { defaultValue: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e", name: "responsible" },
        { defaultValue: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e", name: "administrator" },
        { defaultValue: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e", name: "completedBy" },
        { defaultValue: "2018-06-12T11:13:43+00:00", name: "completedDate" },
        { defaultValue: undefined, name: "objectId" },
        { defaultValue: "test", name: "note" },
        { defaultValue: "AnalysisCollection", name: "type" },
        { defaultValue: undefined, name: "partOf" },
        {
          defaultValue: {
            attachments: ["7b0aac35-3bc4-452f-9f8d-8964a91fdcf0"],
            comment: "vcvcvx",
            extRef: ["bcvbvbvc"],
            registeredBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
            registeredDate: "2018-06-12T11:14:44+00:00",
            type: "GenericResult"
          },
          name: "result"
        },
        { defaultValue: 389, name: "orgId" },
        { defaultValue: "Dating", name: "reason" },
        { defaultValue: ["bcvbvbvc"], name: "externalSource" },
        { defaultValue: "vcvcvx", name: "comments" },
        { defaultValue: true, name: "restrictions" },
        {
          defaultValue: {
            caseNumbers: ["123"],
            expirationDate: "2018-06-13T22:00:00+00:00",
            reason: "dfdfs",
            registeredStamp: {
              date: "2018-06-12T11:14:43+00:00",
              user: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
            },
            requester: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
            requesterName: "Rituvesh Kumar"
          },
          name: "restriction"
        },
        { defaultValue: ["123"], name: "caseNumbers" },
        { defaultValue: undefined, name: "resultFiles" },
        { defaultValue: undefined, name: "completeAnalysis" },
        { defaultValue: undefined, name: "museumNo" },
        { defaultValue: undefined, name: "subNo" },
        { defaultValue: undefined, name: "term" },
        {
          defaultValue: [
            {
              //administrator: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
              affectedThing: "a982bcc0-133c-4af8-99cc-f02df98c2b0b",
              affectedType: "collection",
              analysisTypeId: 27,
              //completedBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
              //completedDate: "2018-06-12T11:13:43+00:00",
              doneBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
              doneDate: "2018-06-12T11:13:19+00:00",
              id: 2,
              note: "test",
              objectData: {
                collection: 1,
                coordinates: [],
                id: 14,
                isDeleted: false,
                locations: [],
                materials: [],
                museumId: 99,
                museumNo: "MusK23",
                objectType: "collection",
                term: "Lite skaft av ben",
                uuid: "a982bcc0-133c-4af8-99cc-f02df98c2b0b"
              },
              partOf: 1,
              registeredBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
              registeredDate: "2018-06-12T11:14:43+00:00",
              responsible: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
              type: "Analysis"
            }
          ],
          name: "events"
        },
        { defaultValue: undefined, name: "analysisTypeCategory" },
        { defaultValue: undefined, name: "updatedBy" },
        { defaultValue: undefined, name: "updatedByName" },
        { defaultValue: undefined, name: "updatedDate" },
        { defaultValue: 1, name: "status" }
      ]);
    });
  });
});
