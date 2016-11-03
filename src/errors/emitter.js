import { EventEmitter } from 'events';
import Rx from 'rxjs/Rx';

// Error emitter (private)
const emitter = new EventEmitter();

// Error emitter (public)
export const emitError = (error) => emitter.emit('error', error);
export const emitSuccess = (success) => emitter.emit('success', success);

// Error source
export const source = Rx.Observable.fromEvent(emitter, 'error');

// Success source
export const successSource = Rx.Observable.fromEvent(emitter, 'success');