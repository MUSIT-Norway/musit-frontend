import React from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import omit from 'lodash/omit';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';

export const initialState = { buffer: '', code: '', uuid: false, number: false };

export const charReducer$ = source$ =>
  source$
    .filter((e: Event) => e.which !== 13)
    .map((e: Event) => String.fromCharCode(e.which))
    .map((c: String) => c.replace(/\+/g, '-'))
    .map((c: String) => state => ({ ...state, buffer: state.buffer + c }));

export const charDebouncer$ = source$ =>
  source$.map(() =>
    state => {
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
  Observable.merge(reducer$, debouncer$, clearScanner$),
  Observable.of(initialState)
);

export const makeStream = source$ =>
  source$
    .filter(state => state.code !== '')
    .map(state => omit(state, 'buffer'))
    .distinctUntilChanged();

export const connectToScanner = (
  processBarcode,
  source$ = makeStream(scanner$),
  clearSource = clearScanner$.next.bind(clearScanner$),
  findNodeByUUID = MusitNode.findByUUID(),
  findNodeByBarcode = MusitNode.findByBarcode(),
  findObjectByBarcode = MusitObject.findByBarcode(),
  findNodeOrObjectByBarcode = MusitNode.findNodeOrObjectByBarcode(),
  classExistsOnDom = className => document.getElementsByClassName(className).length > 0
) =>
  Component => {
    return class Wrapper extends React.Component {
      static propTypes = {
        appSession: PropTypes.object.isRequired
      };

      constructor(props) {
        super(props);
        this.state = { scannerEnabled: false };
        this.toggleScanner = this.toggleScanner.bind(this);
      }

      enableScanner() {
        this.disableScanner();
        this.subscription = source$.subscribe(barCode => {
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
        this.setState({ ...this.state, scannerEnabled });
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
