import React from 'react'
import { PickListComponent } from '../../components/picklist'
import { PageHeader, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'

export default class PickListContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    picks: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    toggleObject: React.PropTypes.func.isRequired,
    removeNode: React.PropTypes.func.isRequired,
    removeObject: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      showActionDialog: false
    }
    this.onOpenActionDialog = this.onOpenActionDialog.bind(this)
    this.onCloseActionDialog = this.onCloseActionDialog.bind(this)
  }

  onOpenActionDialog() {
    this.setState({ showActionDialog: true })
  }

  onCloseActionDialog() {
    this.setState({ showActionDialog: false })
  }

  render() {
    const demoActions = [
      {
        id: 'testAction',
        description: 'Demo Action',
        func: () => ('works')
      },
      {
        id: 'testAction2',
        description: 'Demo Action 2',
        func: () => ('works 2')
      }
    ]
    const style = require('../../components/picklist/index.scss')
    const { translate, toggleNode, toggleObject, removeNode, removeObject } = this.props
    const type = this.props.params.type.toUpperCase();
    const picks = this.props.picks[type]
    const marked = picks.filter(p => p.marked).map(p => p.value)
    const showActionDialog = this.state.showActionDialog
    return (
      <div className={style.picklist}>
        <main>
          <Grid>
            <PageHeader>
              {translate('musit.pickList.title', false)}
            </PageHeader>
            <PickListComponent
              picks={picks}
              marked={marked}
              actions={demoActions}
              showActionDialog={showActionDialog}
              onCloseActionDialog={() => this.onCloseActionDialog()}
              iconRendrer={(pick) => <FontAwesome name={pick.value.name ? 'folder' : 'rebel'} style={{ fontSize: '3.0em' }} />}
              labelRendrer={(pick) => {
                return (
                  <div>
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.displayName}</span>
                    <Breadcrumb
                      nodes={pick.path}
                      onClickCrumb={node => hashHistory.push(`/magasin/${node.id === -1 ? 'root' : node.id}`)}
                      allActive
                    />
                  </div>
                )
              }}
              toggle={(item, on) => (type === 'NODE' ? toggleNode(item, on) : toggleObject(item, on))}
              remove={item => (type === 'NODE' ? removeNode(item) : removeObject(item))}
              move={() => console.log('open modal window')}
            />
            <div style={{ textAlign: 'right' }}>
              {marked.length}/{picks.length} node(r) valgt.
            </div>
          </Grid>
        </main>
      </div>
    )
  }
}
