import { simpleGet, simplePost } from '../shared/RxAjax';
import Analyses from './analyses';
import MusitObject from './object';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';
import concat from 'lodash/concat';
import { Observable } from 'rxjs';

export default class Event {}

Event.concatAnalysesWithMoves = (ajaxGet = simpleGet, ajaxPost = simplePost) => (val) =>
  Observable.forkJoin(
    Analyses.getAnalysesForObject(ajaxGet)(val),
    MusitObject.getLocationHistory(ajaxGet)(val).map(locations =>
      locations.map(loc => ({...loc, type: 'MoveObject', eventDate: loc.registeredDate }))
    )
  ).map(([analyses, moves]) => {
    const events = concat(analyses || [], moves || []);
    return events.map(m => ({...m, eventDate: parseISODate(m.eventDate).format(DATE_FORMAT_DISPLAY)}));
  }).flatMap((events) => {
    const actorIds = uniq(events.map(r => r.registeredBy )).filter(r => r);
    return MusitActor.getActors(ajaxPost)(actorIds, val.token)
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
