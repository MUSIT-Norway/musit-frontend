// @flow
import { simpleGet, simplePost } from '../shared/RxAjax';
import Analysis from './analysis';
import Sample from './sample';
import MusitObject from './object';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';
import concat from 'lodash/concat';
import { Observable } from 'rxjs';
import type { Callback, AjaxGet, AjaxPost } from './types/ajax';

class Event {
  static getAnalysesAndMoves: (
    ajaxGet: AjaxGet,
    ajaxPost: AjaxPost
  ) => (props: {
    id: number, // FIXME the same as objectId
    objectId: number, // FIXME The same as id
    museumId: number,
    token: string,
    callBack?: ?Callback
  }) => Observable;
}

Event.getAnalysesAndMoves = (ajaxGet = simpleGet, ajaxPost = simplePost) => props =>
  Observable.forkJoin(
    Analysis.getAnalysesForObject(ajaxGet)(props),
    MusitObject.getLocationHistory(ajaxGet)(props)
  )
    .map(([analyses, moves]) =>
      concat(analyses, moves.map(m => ({ ...m, type: 'MoveObject' }))).map(m => ({
        ...m,
        eventDate: parseISODate(m.eventDate || m.registeredDate).format(
          DATE_FORMAT_DISPLAY
        )
      }))
    )
    .flatMap(events => {
      const registeredByIds = events.map(r => r.registeredBy).filter(r => r);
      const doneByIds = events.map(r => r.doneBy).filter(r => r);
      const actorIds = uniq(registeredByIds.concat(doneByIds));
      return MusitActor.getActors(ajaxPost)({
        actorIds,
        token: props.token
      }).map(actors => {
        if (Array.isArray(actors)) {
          return events.map(data => {
            const registeredBy = actors.find(a =>
              MusitActor.hasActorId(a, data.registeredBy)
            );
            const doneBy = actors.find(a => MusitActor.hasActorId(a, data.doneBy));
            return {
              ...data,
              registeredBy: registeredBy ? registeredBy.fn : I18n.t('musit.unknown'),
              doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown'),
              doneDate: data.doneDate
                ? parseISODate(data.doneDate).format(DATE_FORMAT_DISPLAY)
                : I18n.t('musit.unknown'),
              registeredDate: data.registeredDate
                ? parseISODate(data.registeredDate).format(DATE_FORMAT_DISPLAY)
                : I18n.t('musit.unknown')
            };
          });
        }
        return events;
      });
    })
    .flatMap(events => {
      return Observable.forkJoin(
        events.map(e => {
          if (e.type === 'SampleCreated') {
            return Sample.loadSample(ajaxGet)({
              id: e.sampleObjectId,
              museumId: props.museumId,
              token: props.token
            }).map(r => ({ ...e, sampleTypeId: r.sampleTypeId }));
          }
          return Observable.of(e);
        })
      );
    });

export default Event;
