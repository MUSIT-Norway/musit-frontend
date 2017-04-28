import { simpleGet, simplePost } from '../shared/RxAjax';
import Analysis from './analysis';
import MusitObject from './object';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';
import concat from 'lodash/concat';
import { Observable } from 'rxjs';

class Event {}

Event.getAnalysesAndMoves = (ajaxGet = simpleGet, ajaxPost = simplePost) =>
  val =>
    Observable.forkJoin(
      Analysis.getAnalysesForObject(ajaxGet)(val),
      MusitObject.getLocationHistory(ajaxGet)(val)
    )
      .map(([analyses, moves]) =>
        concat(analyses, moves.map(m => ({ ...m, type: 'MoveObject' }))).map(m => ({
          ...m,
          eventDate: parseISODate(m.eventDate || m.registeredDate).format(
            DATE_FORMAT_DISPLAY
          )
        })))
      .flatMap(events => {
        const actorIds = uniq(events.map(r => r.registeredBy)).filter(r => r);
        return MusitActor.getActors(ajaxPost)(actorIds, val.token).map(actors => {
          if (Array.isArray(actors)) {
            return events.map(data => {
              const registeredBy = actors.find(a =>
                MusitActor.hasActorId(a, data.registeredBy));
              return {
                ...data,
                registeredBy: registeredBy ? registeredBy.fn : I18n.t('musit.unknown')
              };
            });
          }
          return events;
        });
      });

export default Event;
