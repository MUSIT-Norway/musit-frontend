import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

export default class Breadcrumb extends Component {
  static propTypes = {
    useOverride: React.PropTypes.bool,
    routeSplat: React.PropTypes.string,
    fetchAction: React.PropTypes.func,
    renderMethod: React.PropTypes.func
  }

  componentWillMount() {
    this.fetchAll(this.props)
  }


  componentWillReceiveProps(newProps) {
    // Issued on every propchange, including local route changes
    const oldBreadcrumbIds = this.resolveBreadcrumbIds(this.props)
    const newBreadcrumbIds = this.resolveBreadcrumbIds(newProps)
    if (oldBreadcrumbIds !== newBreadcrumbIds) {
      newBreadcrumbIds.filter((id) => {
        return oldBreadcrumbIds.indexOf(id) === -1
      }).forEach((id) => this.fetchBreadcrumbRecordAction(id))
    }
  }

  resolveBreadcrumbIds(routeSplat) {
    const { useOverride } = this.props

    let breadcrumbIds = []
    if (useOverride) {
      // We dont use splat for breadcrumb. TBI.
      breadcrumbIds = []
    } else {
      breadcrumbIds = this.resolveIds(routeSplat)
    }
    return breadcrumbIds
  }

  fetchAll(routeSplat) {
    const ids = this.resolveBreadcrumbIds(routeSplat)
    ids.forEach((id) => this.fetchBreadcrumbRecordAction(id))
  }

  resolveIds(splat) {
    let splatList = []
    if (splat) {
      splatList = splat.split('/')
    }
    return splatList
  }

  fetchBreadcrumbRecordAction(id) {
    const { fetchAction } = this.props
    if (fetchAction) {
      fetchAction(id)
    }
  }

  renderLabel(id) {
    const { renderMethod } = this.props
    let fragment = (<span><FontAwesome name="folder" /> {id}</span>)
    if (renderMethod) {
      fragment = renderMethod(id)
    }
    return fragment
  }

  render() {
    const breadcrumbIds = this.resolveBreadcrumbIds(this.props)
    return (
      <div>
        {breadcrumbIds.map((id) => this.renderLabel(id))}
        <FontAwesome name="spinner" spin />
      </div>
    )
  }
}
