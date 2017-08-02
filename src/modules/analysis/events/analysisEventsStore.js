// @flow
import { Observable, Subject } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../../models/analysis';
import MusitActor from '../../../models/actor';
import { uniq } from 'lodash';
import { I18n } from 'react-i18nify';

import type { AnalysisCollection, AnalysisType } from 'types/analysis';
import type { Actor } from 'types/actor';

type Actions = {
  setLoading$: Subject<*>,
  getAnalysisEvents$: Subject<*>,
  filterEvents$: Subject<*>
};

export type Extension = {
  registeredByName?: ?string,
  analysisType?: ?AnalysisType
};

export type AnalysisCollectionExtended = AnalysisCollection & Extension;

export const setLoading$: Subject<*> = createAction('setLoading$');
export const filterEvents$: Subject<*> = createAction('filterEvents$');
export const getAnalysisEvents$: Subject<*> = createAction(
  'getAnalysisEvent$'
).switchMap(props =>
  MusitAnalysis.getAnalysisEvents()(props).flatMap(events =>
    MusitActor.getActors()({
      token: props.token,
      actorIds: getUniqueRegisteredByActors(events)
    }).map(actors => combineDataSources(actors || [], events, props.analysisTypes || []))
  )
);

export const getUniqueRegisteredByActors = (
  events: Array<AnalysisCollection>
): Array<string> =>
  (uniq(events.map(event => event.registeredBy)).filter(v => v): Array<any>);

export const combineDataSources = (
  actors: Array<Actor>,
  events: Array<AnalysisCollection>,
  analysisTypes: Array<AnalysisType>
): Array<AnalysisCollectionExtended> => {
  const findActorName = (actorToFind: ?string) => {
    const name = actors.find((a: Actor) => MusitActor.hasActorId(a, actorToFind));
    return name && name.fn;
  };
  const findAnalysisType = (analysisTypeId: number) =>
    analysisTypes.find(analysisType => analysisType.id === analysisTypeId);

  return events.map((event: AnalysisCollection): AnalysisCollectionExtended => ({
    ...event,
    registeredByName: findActorName(event.registeredBy),
    analysisType: findAnalysisType(event.analysisTypeId)
  }));
};

export const filterAnalysisEvents = (
  events: Array<AnalysisCollectionExtended>,
  filter: string
): Array<AnalysisCollectionExtended> => {
  const filterStr = filter.toLowerCase().trim();
  if (filterStr) {
    const matches = (input: ?string) =>
      (input && input.toLowerCase().includes(filterStr)) || false;

    return events.filter(
      (event: AnalysisCollectionExtended) =>
        matches(event.analysisType && event.analysisType.enName) ||
        matches(event.analysisType && event.analysisType.noName) ||
        matches(event.registeredByName) ||
        matches(event.status ? I18n.t('musit.analysis.statusType.' + event.status) : '')
    );
  } else {
    return events;
  }
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.setLoading$.map(() => state => ({ ...state, loading: true })),
    actions.getAnalysisEvents$.map(analysisEvents => state => ({
      ...state,
      analysisEvents,
      analysisEventsFiltered: filterAnalysisEvents(
        analysisEvents,
        state.filterEventValue
      ),
      loading: false
    })),
    actions.filterEvents$.map(filterStr => state => ({
      ...state,
      filterEventValue: filterStr,
      analysisEventsFiltered: filterAnalysisEvents(state.analysisEvents, filterStr)
    }))
  );

export const analysisEventsStore$ = (
  actions$: Actions = {
    setLoading$,
    filterEvents$,
    getAnalysisEvents$
  }
) =>
  createStore(
    'analysisEventsStore',
    reducer$(actions$),
    Observable.of({
      loading: false,
      analysisEvents: [],
      analysisEventsFiltered: [],
      filterEventValue: ''
    })
  );

export default analysisEventsStore$();
