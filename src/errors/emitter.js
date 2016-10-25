import { EventEmitter } from 'events'
import Rx from 'rx'

// Error emitter (private)
const emitter = new EventEmitter();

// Error emitter (public)
export const emitError = (error) => emitter.emit('error', error)

// Error source
export const source = Rx.Observable.fromEvent(emitter, 'error');