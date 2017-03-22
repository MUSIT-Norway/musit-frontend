// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Analyses from '../../models/analyses';
import MusitObject from '../../models/object';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../../shared/util';
import MusitActor from '../../models/actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';

const initialState = [];

const formatEventDate = (event) => parseISODate(event.registeredDate).format(DATE_FORMAT_DISPLAY);

const concatAnalysesWithMoves = (val) =>
  Observable.forkJoin(
    Analyses.getAnalysesForObject()(val),
    MusitObject.getLocationHistory()(val).map(locations =>
      locations.map(loc => ({...loc, type: 'MoveObject' }))
    )
  ).map(([analyses, moves]) => {
    const events = analyses.concat(moves);
    return events.map(m => ({...m, eventDate: formatEventDate(m)}));
  })
  .flatMap((events) => {
    const actorIds = uniq(events.map(r => r.registeredBy )).filter(r => r);
    return MusitActor.getActors()(actorIds, val.token)
     .map(actors => {
       if (!Array.isArray(actors)) {
         return events;
       }
       return events.map((data) => {
         const registeredBy = actors.find(a => a.hasActorId(data.registeredBy));
         return {
           ...data,
           registeredBy: registeredBy ? registeredBy.fn : I18n.t('musit.unknown')
         };
       });
     });
  });

export const loadAnalyses$ = createAction('loadAnalyses$').switchMap(concatAnalysesWithMoves);

const reducer$ = loadAnalyses$.map((data) => () => data);

const eventsStore$ = createStore('allEvents', reducer$, Observable.of(initialState));

export default eventsStore$;