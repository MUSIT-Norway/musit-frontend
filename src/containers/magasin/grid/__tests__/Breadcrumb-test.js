import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import Layout from '../../../../layout'
import Breadcrumb from '../../../../layout/Breadcrumb'

describe('StorageUnitsContainer_Breadcrumb_test', () => {
  let myDiv = {}
  const renderer = ReactTestUtils.createRenderer()

  const setup = () => {
    const nodes = [{ id: 1, name: 'Museum', type: 'Building' }, { key: 2, id: 2, name: 'Bygg1', type: 'Building' },
    { key: 3, id: 3, name: 'Pauserom', type: 'Room' }]
    const nodeTypes = [{ key: 1, type: 'Room', iconName: 'folder' }]
    const makeBreadcrumb = (n, nt) => {
      return (
        <Breadcrumb
          nodes={n}
          nodeTypes={nt}
          onClickCrumb={(nn, i) => `Node: ${nn} ${i}`}
        />
        )
    }
    const bc = makeBreadcrumb(nodes, nodeTypes)
    renderer.render(
      <Layout
        title={'Tittel'}
        translate={() => 'Translater'}
        content={<div />}
        breadcrumb={bc}
      />)
    myDiv = renderer.getRenderOutput()
  }

  it('Breadcrumb first element should have name "Museum": ', () => {
    setup()
    const bc = myDiv.props.children.props.children.props.children[1].props.children[0].props.children

    assert(bc.props.nodes[0].name === 'Museum')
  })
  it('Breadcrumb nodetypes has elements ', () => {
    setup()
    const bc = myDiv.props.children.props.children.props.children[1].props.children[0].props.children
    assert(bc.props.nodeTypes.length !== 0)
  }
)
});
