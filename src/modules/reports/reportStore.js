import { Observable, Subject } from 'rxjs';
import { I18n } from 'react-i18nify';
import { createStore } from 'react-rxjs/dist/RxStore';

export const loadKDReport$  = new Subject().switchMap