import * as React from 'react';
import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { omit } from 'lodash';
import MusitObject from '../models/object';
import MusitNode from '../models/node';
import { MUSTFIX, TODO } from '../types/common';
import { AppSession } from '../types/appSession';

export const initialState = {
  buffer: '',
  code: '',
  uuid: false,
  number: false
};

export const charReducer$ = (source$: TODO) =>
  source$
    .filter((e: Event) => (e as MUSTFIX).which !== 13)
    .map((e: Event) => String.fromCharCode((e as MUSTFIX).which))
    .map((c: String) => c.replace(/\+/g, '-'))
    .map((c: String) => (state: TODO) => ({ ...state, buffer: state.buffer + c }));

export const charDebouncer$ = (source$: TODO) =>
  source$.map(() => (state: TODO) => {
    const buffer = state.buffer;
    const number = /^\d+$/.test(buffer);
    const uuid = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(buffer);
    return { ...state, buffer: '', code: buffer, uuid, number };
  });

const clearScanner$ = createAction('clearScanner$').map(() => () => initialState);
const reducer$ = charReducer$(Observable.fromEvent(window.document, 'keypress'));
const debouncer$ = charDebouncer$(reducer$.debounce(() => Observable.timer(50)));
const scanner$ = createStore(
  'scanner',
  Observable.merge(reducer$, debouncer$, clearScanner$) as TODO,
  initialState
);

export const makeStream = (source$: TODO) =>
  source$
    .filter((state: TODO) => state.code !== '')
    .map((state: TODO) => omit(state, 'buffer'))
    .distinctUntilChanged();

interface WrapperProps {
  appSession: AppSession;
}

interface WrapperState {
  scannerEnabled: boolean;
}

export const connectToScanner = (
  processBarcode: TODO,
  source$ = makeStream(scanner$),
  clearSource = (clearScanner$ as MUSTFIX).next.bind(clearScanner$),
  findNodeByUUID = MusitNode.findByUUID(),
  findNodeByBarcode = MusitNode.findByBarcode(),
  findObjectByBarcode = MusitObject.findByBarcode(),
  findNodeOrObjectByBarcode = MusitNode.findNodeOrObjectByBarcode(),
  classExistsOnDom = (className: string) =>
    document.getElementsByClassName(className).length > 0
) => (Component: MUSTFIX) => {
  return class Wrapper extends React.Component<WrapperProps, WrapperState> {
    /*Old: 
    static propTypes = {
      appSession: PropTypes.object.isRequired
    };
    */

    constructor(props: WrapperProps) {
      super(props);
      this.state = { scannerEnabled: false };
      this.toggleScanner = this.toggleScanner.bind(this);
    }

    subscription: MUSTFIX; //subscription snakkes om endel, men er ikke definert noe sted...

    enableScanner() {
      this.disableScanner();
      this.subscription = source$.subscribe((barCode: TODO) => {
        clearSource();
        processBarcode(barCode, {
          ...this.props,
          findNodeByUUID,
          findNodeByBarcode,
          findObjectByBarcode,
          findNodeOrObjectByBarcode,
          classExistsOnDom
        });
      });
    }

    disableScanner() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    }

    toggleScanner(scannerEnabled = !this.state.scannerEnabled) {
      this.setState(ps => ({ ...ps, scannerEnabled }));
      if (scannerEnabled) {
        this.enableScanner();
      } else {
        this.disableScanner();
      }
    }

    componentWillUnmount() {
      this.disableScanner();
    }

    render() {
      return (
        <Component {...this.props} {...this.state} toggleScanner={this.toggleScanner} />
      );
    }
  };
};

export default connectToScanner;
