import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { addObservation } from '../../reducers/observation'
import { loadPath } from '../../reducers/storageunit/grid'

const mapStateToProps = (state) => {
  return {
    actor: state.auth.actor,
    translate: (key, markdown) => Language.translate(key, markdown),
    path: state.storageGridUnit.root.path
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveObservation: (id, data) => {
      dispatch(addObservation(id, data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => alert('ikke istand til å lagre')
      }))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    actor: PropTypes.object,
    path: React.PropTypes.arrayOf(React.PropTypes.object),
    loadPath: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onClickCrumb = this.onClickCrumb.bind(this)
  }

  componentWillMount() {
    this.props.loadPath(this.props.params.id)
  }

  onClickCrumb(node) {
    hashHistory.push(node.url)
  }

  render() {
    const nodes = this.props.path
    const breadcrumb = <Breadcrumb nodes={nodes} onClickCrumb={this.onClickCrumb} />
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={this.props.onSaveObservation}
              translate={this.props.translate}
              mode="ADD"
              doneBy={this.props.actor}
            />
          </div>
        }
      />
    )
  }
}
