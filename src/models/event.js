// @flow
import { simpleGet, simplePost } from '../shared/RxAjax';
import Analysis from './analysis';
import Sample from './sample';
import MusitObject from './object';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';

import { I18n } from 'react-i18nify';
import concat from 'lodash/concat';
import { Observable } from 'rxjs';
import type { Callback, AjaxGet, AjaxPost } from '../types/ajax';

class Event {
  static getAnalysesAndMoves: (
    ajaxGet: AjaxGet<*>,
    ajaxPost: AjaxPost<*>
  ) => (props: {
    id: number, // FIXME the same as objectId
    objectId: number, // FIXME The same as id
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback<*>
  }) => Observable<*>;
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
      //TODO extract it to utils
      const getActors = n => {
        if (!n.doneBy && !n.registeredBy) return [];
        if (!n.doneBy) return [n.registeredBy];
        if (!n.registeredBy) return [n.doneBy];
        return [n.doneBy, n.registeredBy];
      };
      const actorIds = uniq(flatMap(events, getActors));
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
      if (events.length === 0) {
        return Observable.of(events);
      }
      // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
      return Observable.forkJoin(
        events.map(e => {
          if (e.type === 'SampleCreated') {
            return Sample.loadSample(ajaxGet)({
              id: e.sampleObjectId,
              museumId: props.museumId,
              collectionId: props.collectionId,
              token: props.token
            }).map(r => ({ ...e, sampleTypeId: r.sampleTypeId }));
          }
          return Observable.of(e);
        })
      );
    });

export default Event;
