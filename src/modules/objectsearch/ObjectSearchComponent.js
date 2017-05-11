import React from 'react';
import ReactDOM from 'react-dom';
import { I18n } from 'react-i18nify';
import {
  Grid,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Table
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import PagingToolbar from '../../components/PagingToolbar';
import Loader from 'react-loader';
import Config from '../../config';
import MusitObject from '../../models/object';

export class ObjectSearchComponent extends React.Component {
  static propTypes = {
    objectSearchStore: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      perPage: 50,
      currentPage: 1
    };
    this.getMuseumNo = props.getMuseumNo || (() => this.museumNo.value);
    this.getSubNo = props.getSubNo || (() => this.subNo.value);
    this.getTerm = props.getTerm || (() => this.term.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appSession.museumId.id !== this.props.appSession.museumId.id) {
      this.searchForObjects(1, nextProps.appSession.museumId);
    }
  }

  render() {
    const store = this.props.objectSearchStore;
    return (
      <div style={{ paddingTop: 20 }}>
        <main>
          <Grid>
            <div>
              <h1>{I18n.t('musit.objectsearch.title')}</h1>
              <Form inline>
                {this.renderParam('museumNo')}
                {' '}
                {this.renderParam('subNo')}
                {' '}
                {this.renderParam('term', { width: '440px' })}
                {' '}
                <Button
                  className="SubmitButton"
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    this.searchForObjects(1);
                  }}
                >
                  <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
                </Button>
              </Form>
              <br />
              <h4>
                {store.loaded &&
                  (store.data.totalMatches > 0
                    ? I18n.t('musit.objectsearch.results.title', {
                        count: store.data.totalMatches
                      })
                    : I18n.t('musit.objectsearch.results.noHit'))}
              </h4>
              <Loader loaded={!store.loading}>
                {store.data.matches.length > 0 &&
                  <div>
                    <PagingToolbar
                      numItems={store.data.totalMatches}
                      currentPage={this.state.currentPage}
                      perPage={this.state.perPage}
                      onClick={page => this.searchForObjects(page)}
                    />
                    <Table responsive hover condensed>
                      <thead>
                        <tr>
                          <th>{I18n.t('musit.objectsearch.museumNo.label')}</th>
                          <th>{I18n.t('musit.objectsearch.subNo.label')}</th>
                          <th>{I18n.t('musit.objectsearch.term.label')}</th>
                          <th>{I18n.t('musit.objectsearch.location.label')}</th>
                          <th style={{ textAlign: 'center' }}>
                            <a
                              href=""
                              onClick={e => {
                                e.preventDefault();
                                store.data.matches.forEach(obj =>
                                  this.props.pickObject({
                                    object: obj,
                                    breadcrumb: obj.breadcrumb,
                                    museumId: this.props.appSession.museumId,
                                    collectionId: this.props.appSession.collectionId,
                                    token: this.props.appSession.accessToken
                                  }));
                              }}
                              title={I18n.t('musit.objectsearch.addAllToPickList')}
                            >
                              <FontAwesome
                                style={{ fontSize: '1.3em' }}
                                name="shopping-cart"
                              />
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.data.matches.map((data, i) => {
                          const isMainObject = !data.mainObjectId ||
                            MusitObject.isMainObject(data);
                          const isChildObject = data.mainObjectId &&
                            !MusitObject.isMainObject(data);
                          return (
                            <tr
                              key={i}
                              className={
                                isChildObject
                                  ? 'childObject'
                                  : isMainObject && 'mainObject'
                              }
                              onClick={() =>
                                this.props.goTo(
                                  Config.magasin.urls.client.object.gotoObject(data.uuid)
                                )}
                            >
                              <td className="museumNo">{data.museumNo}</td>
                              <td className="subNo">{data.subNo}</td>
                              <td className="term">{data.term}</td>
                              <td className="path">
                                {data.breadcrumb.length > 0 &&
                                  <Breadcrumb
                                    node={data}
                                    allActive
                                    onClickCrumb={node => {
                                      if (node.nodeId) {
                                        this.props.goTo(
                                          Config.magasin.urls.client.storagefacility.goToNode(
                                            node.nodeId,
                                            this.props.appSession
                                          )
                                        );
                                      } else {
                                        this.props.goTo(
                                          Config.magasin.urls.client.storagefacility.goToRoot(
                                            this.props.appSession
                                          )
                                        );
                                      }
                                    }}
                                  />}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {isMainObject &&
                                  <Button
                                    bsStyle="link"
                                    onClick={e => {
                                      this.props.pickObject({
                                        object: data,
                                        breadcrumb: data.breadcrumb,
                                        museumId: this.props.appSession.museumId,
                                        collectionId: this.props.appSession.collectionId,
                                        token: this.props.appSession.accessToken
                                      });
                                      e.stopPropagation();
                                    }}
                                    title={I18n.t('musit.objectsearch.addToPickList')}
                                  >
                                    {this.props.isItemAdded(
                                      data,
                                      this.props.pickList.objects
                                    )
                                      ? <FontAwesome
                                          style={{ fontSize: '1.3em', color: 'Gray' }}
                                          name="shopping-cart"
                                        />
                                      : <FontAwesome
                                          style={{ fontSize: '1.3em' }}
                                          name="shopping-cart"
                                        />}
                                  </Button>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <PagingToolbar
                      numItems={store.data.totalMatches}
                      currentPage={this.state.currentPage}
                      perPage={this.state.perPage}
                      onClick={page => {
                        this.searchForObjects(page);
                      }}
                    />
                  </div>}
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
          style={{ ...style }}
          type="text"
          placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
          onChange={e => this.props.onChangeField(id, e.target.value)}
          ref={field => this[id] = ReactDOM.findDOMNode(field)}
        />
      </FormGroup>
    );
  }

  searchForObjects(page, museumId = this.props.appSession.museumId) {
    this.setState({ ...this.state, currentPage: page });
    this.props.clearSearch();
    return this.props.searchForObjects({
      museumNo: this.getMuseumNo(),
      subNo: this.getSubNo(),
      term: this.getTerm(),
      perPage: this.state.perPage,
      page,
      museumId,
      collectionId: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken
    });
  }
}

export default ObjectSearchComponent;
