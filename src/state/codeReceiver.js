import { Observable, Subject } from 'rxjs/Rx';

const clearAction$ = new Subject();

const keyPress$ = Observable.fromEvent(window, 'keypress').map(e => String.fromCharCode(e.which));

Observable.merge(
  clearAction$.map(() => () => ''),
  keyPress$.map(text => state => `${state}${text.replace('\\+', '-')}`)
).scan((state, changeFn) => changeFn(state), '')
  .map(text => text.replace(/\+/g, '-'))
  .filter(text => text.length === 36/* && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)*/)
  .subscribe(uuid => {
    console.log(uuid);
    clearAction$.next();
  });
