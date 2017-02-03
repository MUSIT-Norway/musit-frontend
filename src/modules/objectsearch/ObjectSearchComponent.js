import React from 'react';
import {I18n} from 'react-i18nify';
import {Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import PagingToolbar from '../../shared/paging';
import {hashHistory} from 'react-router';
import Loader from 'react-loader';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import inject from 'react-rxjs/dist/RxInject';
import objectSearchStore$, {clearSearch$, searchForObjects$, onChangeField$} from './objectSearchStore';

export function renderParam(id, props, style) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{I18n.t(`musit.objectsearch.${id}.label`)}</ControlLabel>
      {' '}
      <FormControl
        style={{...style}}s
        type="text"
        placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
        value={props.params[id] || ''}
        onChange={(e) => props.onChangeField(id, e.target.value)}
      />
    </FormGroup>
  );
}

export const ObjectSearchComponent = (props) =>
  <div style={{paddingTop: 20}}>
    <main>
      <Grid>
        <div>
          <h1>{I18n.t('musit.objectsearch.title')}</h1>
          <Form inline>
            {renderParam('museumNo', props)}
            {' '}
            {renderParam('subNo', props)}
            {' '}
            {renderParam('term', props, {width: '440px'})}
            {' '}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                props.searchForObjects({
                  params:props.store.params,
                  page: 1,
                  museumId: props.appSession.getMuseumId(),
                  collectionId: props.appSession.getCollectionId(),
                  token: props.appSession.getAccessToken()
                });
              }}
            >
              <FontAwesome name="search" style={{fontSize: '1.3em'}}/>
            </Button>
          </Form>
          <br />
          <h4>
            {props.loaded &&
            (props.store.data.totalMatches > 0 ?
                I18n.t('musit.objectsearch.results.title', {count: props.data.totalMatches})
                :
                I18n.t('musit.objectsearch.results.noHit')
            )
            }
          </h4>
          <Loader loaded={!props.loading}>
          {props.store.data && props.store.data.matches.length > 0 &&
          <div>
            <PagingToolbar
              numItems={props.store.data.totalMatches}
              baseUrl={props.location.pathname}
              currentPage={props.store.params.currentPage}
              perPage={props.store.params.perPage}
              onClick={(page) => props.searchForObjects(
                props.store.params,
                page,
                props.appSession.getMuseumId(),
                props.appSession.getCollectionId(),
                props.appSession.getAccessToken())
              }
            />
            <Table>
              <thead>
              <tr>
                <th>{I18n.t('musit.objectsearch.museumNo.label')}</th>
                <th>{I18n.t('musit.objectsearch.subNo.label')}</th>
                <th>{I18n.t('musit.objectsearch.term.label')}</th>
                <th>{I18n.t('musit.objectsearch.location.label')}</th>
                <th>
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      props.store.data.matches.forEach(obj =>
                        props.pickObject(
                          obj,
                          obj.breadcrumb,
                          props.appSession.getMuseumId(),
                          props.appSession.getCollectionId(),
                          props.appSession.getAccessToken()
                        )
                      );
                    }}
                    title={I18n.t('musit.objectsearch.addAllToPickList')}
                  >
                    <FontAwesome name="shopping-cart" style={{fontSize: '1.3em'}}/>
                  </a>
                </th>
              </tr>
              </thead>
              <tbody>
                {props.store.data.matches.map((data, i) => {
                  const isMainObject = !data.mainObjectId || data.isMainObject();
                  const isChildObject = data.mainObjectId && !data.isMainObject();
                  return (
                    <tr key={i} className={isChildObject ? 'childObject' : isMainObject && 'mainObject'}>
                      <td className="museumNo">{data.museumNo}</td>
                      <td className="subNo">{data.subNo}</td>
                      <td className="term">{data.term}</td>
                      <td className="path">
                        {data.breadcrumb.length > 0 &&
                        <Breadcrumb
                          node={data}
                          allActive
                          onClickCrumb={(node) => hashHistory.push(node.url) }
                        />
                        }
                      </td>
                      <td className="move">
                        {isMainObject &&
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.pickObject(
                              data,
                              data.breadcrumb,
                              props.appSession.getMuseumId(),
                              props.appSession.getCollectionId(),
                              props.appSession.getAccessToken()
                            );
                          }}
                          title={I18n.t('musit.objectsearch.addToPickList')}
                        >
                          <FontAwesome name="shopping-cart" style={{fontSize: '1.3em'}}/>
                        </a>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <PagingToolbar
              numItems={props.store.data.totalMatches}
              currentPage={props.store.params.currentPage}
              perPage={props.store.params.perPage}
              onClick={(page) => props.searchForObjects({
                params:props.store.params,
                page,
                museumId: props.appSession.getMuseumId(),
                collectionId: props.appSession.getCollectionId(),
                token: props.appSession.getAccessToken()
              })}
            />
          </div>
          }
          </Loader>
        </div>
      </Grid>
    </main>
  </div>;

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  store$: objectSearchStore$
};


const commands = {
  clearSearch$,
  searchForObjects$,
  onChangeField$
};

const props = {
  pickObject: MusitObject.pickObject
};

export default inject(data, commands, props)(ObjectSearchComponent);


