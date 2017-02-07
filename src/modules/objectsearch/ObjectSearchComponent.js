import React from 'react';
import ReactDOM from 'react-dom';
import {I18n} from 'react-i18nify';
import {Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import PagingToolbar from '../../shared/paging';
import {hashHistory} from 'react-router';
import Loader from 'react-loader';
import {Observable} from 'rxjs';
import MusitObject from '../../models/object';
import inject from 'react-rxjs/dist/RxInject';
import objectSearchStore$, {clearSearch$, searchForObjects$, onChangeField$} from './objectSearchStore';

export class ObjectSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      perPage: 50,
      currentPage: 1
    };
  }

  render() {
    return (
      <div style={{paddingTop: 20}}>
        <main>
          <Grid>
            <div>
              <h1>{I18n.t('musit.objectsearch.title')}</h1>
              <Form inline>
                {this.renderParam('museumNo')}
                {' '}
                {this.renderParam('subNo')}
                {' '}
                {this.renderParam('term', {width: '440px'})}
                {' '}
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(this.museumNo.value);
                    this.searchForObjects(1);
                  }}
                >
                  <FontAwesome name="search" style={{fontSize: '1.3em'}}/>
                </Button>
              </Form>
              <br />
              <h4>
                {this.props.store.loaded &&
                (this.props.store.data.totalMatches > 0 ?
                    I18n.t('musit.objectsearch.results.title', {count: this.props.store.data.totalMatches})
                    :
                    I18n.t('musit.objectsearch.results.noHit')
                )
                }
              </h4>
              <Loader loaded={!this.props.store.loading}>
                {this.props.store.data.matches.length > 0 &&
                <div>
                  <PagingToolbar
                    numItems={this.props.store.data.totalMatches}
                    currentPage={this.state.currentPage}
                    perPage={this.state.perPage}
                    onClick={(page) => this.searchForObjects(page)
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
                            this.props.store.data.matches.forEach(obj =>
                              this.props.pickObject(
                                obj,
                                obj.breadcrumb,
                                this.props.appSession.getMuseumId(),
                                this.props.appSession.getCollectionId(),
                                this.props.appSession.getAccessToken()
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
                    {this.props.store.data.matches.map((data, i) => {
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
                                this.props.pickObject(
                                  data,
                                  data.breadcrumb,
                                  this.props.appSession.getMuseumId(),
                                  this.props.appSession.getCollectionId(),
                                  this.props.appSession.getAccessToken()
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
                    numItems={this.props.store.data.totalMatches}
                    currentPage={this.state.currentPage}
                    perPage={this.state.perPage}
                    onClick={(page) => {
                      this.searchForObjects(page);
                    }}
                  />
                </div>
                }
              </Loader>
            </div>
          </Grid>
        </main>
      </div>
    );
  }

  renderParam(id, style) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{I18n.t(`musit.objectsearch.${id}.label`)}</ControlLabel>
        {' '}
        <FormControl
          style={{...style}}
          type="text"
          placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
          onChange={(e) => this.props.onChangeField(id, e.target.value)}
          ref={ (field) => this[id] = ReactDOM.findDOMNode(field) }
        />
      </FormGroup>
    );
  }

  searchForObjects(page) {
    this.setState({...this.state, currentPage: page});
    return this.props.searchForObjects({
      params: {
        museumNo: this.museumNo.value,
        subNo: this.subNo.value,
        term: this.term.value,
        perPage: this.state.perPage
      },
      page,
      museumId: this.props.appSession.getMuseumId(),
      collectionId: this.props.appSession.getCollectionId(),
      token: this.props.appSession.getAccessToken()
    });
  }
}


const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
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


