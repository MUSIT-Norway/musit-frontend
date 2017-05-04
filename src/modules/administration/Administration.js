import React from 'react';
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import inject from 'react-rxjs/dist/RxInject';
import { hashHistory } from 'react-router';
import flowRight from 'lodash/flowRight';
import { makeUrlAware } from '../app/appSession';

const administrations = [
  {
    title: 'musit.administration.analysisTypes.analysisTypes',
    url: Config.magasin.urls.client.administration.goToAnalysisTypes,
    description: 'musit.administration.analysisTypes.description'
  },
  {
    title: 'musit.administration.analysisPlaces.analysisPlaces',
    url: Config.magasin.urls.client.administration.goToAnalysisPlaces,
    description: 'musit.administration.analysisPlaces.description'
  },{
    title: 'musit.administration.sampleTypes.sampleTypes',
    url: Config.magasin.urls.client.administration.goToSampleTypes,
    description: 'musit.administration.sampleTypes.description'
  }
];

export const Administration = props => {
  return (
    <div>
      <main>
        <Panel>
          <Grid>
            <Row className="row-centered">
              <PageHeader>
                {I18n.t('musit.administration.administration')}
              </PageHeader>
              <Table>
                <thead>
                <tr>
                  <th>{I18n.t('musit.administration.titleHeader')}</th>
                  <th>{I18n.t('musit.administration.descriptionHeader')}</th>
                </tr>
                </thead>
                <tbody>
                {administrations.map((a, index) => {
                  const url = a.url(props.appSession);
                  return (
                    <tr key={index} id={a.id}>
                      <td>
                        <a
                          href={url}
                          onClick={e => {
                              e.preventDefault();
                              hashHistory.push(url(props.appSession));
                            }}
                        >
                          {I18n.t(a.title)}
                        </a>
                      </td>
                      <td>
                        {I18n.t(a.description)}
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </Table>
            </Row>
          </Grid>
        </Panel>
      </main>
    </div>
  );
};

const data = {
  appSession$: { type: React.PropTypes.object.isRequired }
};

export default flowRight([inject(data), makeUrlAware])(Administration);
