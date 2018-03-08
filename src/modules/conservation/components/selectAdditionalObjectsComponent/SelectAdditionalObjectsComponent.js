import React from 'react';
import Modal from '../../../../components/modal/MusitModal';
import PropTypes from 'prop-types';
import { RxInjectLegacy as inject } from 'react-rxjs';
import appSession$ from '../../../../stores/appSession';
import {
  actions as searchActions,
  store$ as searchStore$
} from '../../../objectsearch/searchStore';
import { I18n } from 'react-i18nify';

const data = {
  appSession$,
  searchStore$
};

export class SelectAdditionalObjectsComponent extends React.Component {
  static propTypes = {
    appSession: PropTypes.object.isRequired,
    searchStore: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    changeQuery: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    addObjects: PropTypes.func.isRequired
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  componentWillReceiveProps(props) {
    if (props.searchStore.result && props.searchStore.result.hits) {
      this.loadObjects(props);
    }
  }

  onChangeQueryParam(name: string, value: string) {
    this.props.clear();
    this.props.changeQuery({ name, value });
  }

  loadObjects(props) {
    const objects =
      (props.searchStore.result &&
        props.searchStore.result.hits.hits.map(o => ({
          ...o._source,
          selected: false
        }))) ||
      [];
    console.log('Objects', objects);
    this.setState(() => ({
      objects
    }));
  }

  toggleObject(object, index) {
    this.setState(prevState => ({
      objects: [
        ...prevState.objects.slice(0, index),
        {
          ...prevState.objects[index],
          selected: prevState.objects[index].selected ? false : true
        },
        ...prevState.objects.slice(index + 1)
      ]
    }));
  }

  onSearch() {
    this.props.clear();
    this.props.setLoading();
    this.props.search({
      from: 0,
      limit: 100,
      queryParam: this.props.searchStore.queryParam,
      museumId: this.props.appSession.museumId,
      collectionIds: this.props.appSession.collectionId,
      token: this.props.appSession.accessToken
    });
  }
  render() {
    const body = (
      <div>
        <div className="form-group">
          <label htmlFor="query"> {I18n.t('musit.texts.searchData')}</label>
          <input
            type="text"
            className="form-control"
            id="q"
            onChange={v => this.onChangeQueryParam('q', v.target.value)}
          />
        </div>
        <button
          onClick={() => {
            this.onSearch();
          }}
        >
          {I18n.t('musit.texts.search')}
        </button>
        <table className="table">
          <thead>
            <tr key={'resultat'}>
              <th> {I18n.t('musit.objectsearch.museumNo.label')}</th>
              <th> {I18n.t('musit.objectsearch.subNo.label')}</th>
              <th> {I18n.t('musit.objectsearch.term.label')}</th>
              <th> {I18n.t('musit.texts.select')}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.objects.map((o, i) => (
              <tr key={`resultat_${i}`}>
                <td>{o.museumNo}</td>
                <td>{o.subNo}</td>
                <td>{o.term}</td>
                <td
                  onClick={() => {
                    this.toggleObject(this.state.objects[i], i);
                  }}
                >
                  {o.selected ? (
                    I18n.t('musit.texts.selected')
                  ) : (
                    I18n.t('musit.texts.notSelected')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            this.props.addObjects(
              this.state.objects
                .map(o => ({ id: o.id, selected: o.selected, ...o }))
                .filter(o => o.selected)
                .map(o => o)
            );
            this.context.closeModal();
          }}
        >
          {I18n.t('musit.texts.select')}
        </button>
      </div>
    );

    return <Modal body={body} />;
  }
}

export default inject(data, searchActions)(SelectAdditionalObjectsComponent);
