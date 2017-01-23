import React from 'react';
import {I18n} from 'react-i18nify';
import {Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import PagingToolbar from '../../shared/paging';
import {hashHistory} from 'react-router';
import Loader from 'react-loader';


export function renderParam(id, props, style) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{I18n.t(`musit.objectsearch.${id}.label`)}</ControlLabel>
      {' '}
      <FormControl
        style={{...style}}
        type="text"
        placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
        value={props.params[id] || ''}
        onChange={(e) => props.onChangeField(id, e.target.value)}
      />
    </FormGroup>
  );
}

export default (props) =>
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
                props.searchForObjects(props.params, 1, props.user.museumId, props.user.collectionId);
              }}
            >
              <FontAwesome name="search" style={{fontSize: '1.3em'}}/>
            </Button>
          </Form>
          <br />
          <h4>
            {props.loaded &&
            (props.data.totalMatches > 0 ?
                I18n.t('musit.objectsearch.results.title', {count: props.data.totalMatches})
                :
                I18n.t('musit.objectsearch.results.noHit')
            )
            }
          </h4>
          <Loader loaded={!props.loading}>
          {props.data.matches.length > 0 &&
          <div>
            <PagingToolbar
              numItems={props.data.totalMatches}
              baseUrl={props.location.pathname}
              currentPage={props.params.currentPage}
              perPage={props.params.perPage}
              onClick={(page) => props.searchForObjects(props.params, page, props.user.museumId, props.user.collectionId)}
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
                      props.pickObjects(props.data.matches, props.user.museumId, props.user.collectionId);
                    }}
                    title={I18n.t('musit.objectsearch.addAllToPickList')}
                  >
                    <FontAwesome name="shopping-cart" style={{fontSize: '1.3em'}}/>
                  </a>
                </th>
              </tr>
              </thead>
              <tbody>
                {props.data.matches.map((data, i) => {
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
                            props.pickObject(data, data.breadcrumb, props.user.museumId, props.user.collectionId);
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
              numItems={props.data.totalMatches}
              currentPage={props.params.currentPage}
              perPage={props.params.perPage}
              onClick={(page) => props.searchForObjects(props.params, page, props.user.museumId, props.user.collectionId)}
            />
          </div>
          }
          </Loader>
        </div>
      </Grid>
    </main>
  </div>;