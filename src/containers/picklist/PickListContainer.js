import React from 'react'
import { PickListComponent } from '../../components/picklist'
import { PageHeader, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'

export default class PickListContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    picks: React.PropTypes.array.isRequired,
    marked: React.PropTypes.array.isRequired,
    onToggleMarked: React.PropTypes.func.isRequired,
    activate: React.PropTypes.func.isRequired,
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

  componentWillMount() {
    this.props.activate(this.props.params.type)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.type !== this.props.params.type) {
      this.props.activate(nextProps.params.type)
    }
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
    const { translate, picks, marked, onToggleMarked } = this.props
    const { showActionDialog } = this.state
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
              iconRendrer={(pick) => <FontAwesome name={pick.name ? 'folder' : 'rebel'} style={{ fontSize: '3.5em' }} />}
              labelRendrer={(pick) => {
                return (
                  <div>
                    <span style={{ paddingLeft: '1em' }}>{pick.name ? pick.name : pick.displayName}</span>
                    <Breadcrumb
                      nodes={pick.path}
                      onClickCrumb={node => hashHistory.push(`/magasin/${node.id === -1 ? 'root' : node.id}`)}
                      allActive
                    />
                  </div>
                )
              }}
              onToggleMarked={onToggleMarked}
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
