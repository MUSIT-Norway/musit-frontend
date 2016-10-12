import { assert } from '../../../../test/setup'
import deepFreeze from 'deep-freeze'

import picklistReducer, {
  addObject, addNode,
  toggleNode, toggleObject,
  removeNode, removeObject,
  clearNodes, clearObjects,
  LOAD_ONE_NODE_SUCCESS
} from '../index'

const node1 = {
  id: 1,
  name: 'Test 1'
}

const node2 = {
  id: 2,
  name: 'Test 2'
}

const node3 = {
  id: 3,
  name: 'Test 3'
}

const DEFAULT_NODES = [
  {
    marked: false,
    path: [],
    value: node1
  },
  {
    marked: false,
    path: [],
    value: node2
  },
  {
    marked: false,
    path: [],
    value: node3
  }
];

const object1 = {
  id: 1,
  mame: 'Some test object'
}

const object2 = {
  id: 2,
  mame: 'Some test object 2'
}

const DEFAULT_OBJECTS = [
  {
    marked: false,
    path: [],
    value: object1
  },
  {
    marked: false,
    path: [],
    value: object2
  }
]

describe('PicklistReducer', () => {
  let testState;

  beforeEach(() => {
    testState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS
    }
    deepFreeze(testState)
  })

  it('Initial state is set', () => {
    const state = picklistReducer()
    const expectedState = {
      NODE: [],
      OBJECT: []
    }
    assert.deepStrictEqual(state, expectedState, 'Should have default state')
  })

  it('New state is set untouched', () => {
    const state = picklistReducer(testState, {})
    assert(state === testState)
  })

  it('Clear objects, resets objects array', () => {
    const newState = picklistReducer(testState, clearObjects())
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: []
    }
    assert.deepStrictEqual(newState, expectedState, 'Objects should be cleared')
  })

  it('Clear nodes, resets nodes array', () => {
    const newState = picklistReducer(testState, clearNodes())
    const expectedState = {
      NODE: [],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Nodes should be cleareds')
  })

  it('Add node, adds item to node array', () => {
    const item = {
      id: 888,
      name: 'special node'
    }
    const newState = picklistReducer(testState, addNode(item))
    const expectedState = {
      NODE: DEFAULT_NODES.concat({
        marked: false,
        path: [],
        value: item
      }),
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be added')
  })

  it('Add node twice, adds item only once to node array', () => {
    const item = {
      id: 888,
      name: 'special node'
    }
    const newState1 = picklistReducer(testState, addNode(item))
    const newState2 = picklistReducer(newState1, addNode(item))
    const expectedState = {
      NODE: DEFAULT_NODES.concat({
        marked: false,
        path: [],
        value: item
      }),
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState2, expectedState, 'Node should be added')
  })


  it('Add node with path, adds item and path to node array', () => {
    const item = {
      id: 888,
      name: 'special node'
    }
    const path = [
      {
        id: 4444,
        name: 'Some nodes'
      },
      {
        id: 55555,
        name: 'Some strange unit'
      }
    ]
    const newState = picklistReducer(testState, addNode(item, path))
    const expectedState = {
      NODE: DEFAULT_NODES.concat({
        marked: false,
        path: path,
        value: item
      }),
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be added')
  })

  it('Remove node, remove item from node array', () => {
    const newState = picklistReducer(testState, removeNode(node2))
    const expectedState = {
      NODE: [
        {
          marked: false,
          path: [],
          value: node1
        },
        {
          marked: false,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be removed')
  })

  it('Remove all nodes, remove nodes from node array', () => {
    const newState = picklistReducer(testState, removeNode([node1, node2, node3]))
    const expectedState = {
      NODE: [],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be removed')
  })

  it('Add object, adds object to object array', () => {
    const item = {
      id: 7777,
      mame: 'Some test object'
    }
    const newState = picklistReducer(testState, addObject(item))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS.concat({
        marked: false,
        path: [],
        value: item
      })
    }
    assert.deepStrictEqual(newState, expectedState, 'Object should be added')
  })

  it('Add object twice, adds object only once to object array', () => {
    const item = {
      id: 7777,
      mame: 'Some test object'
    }
    const newState1 = picklistReducer(testState, addObject(item))
    const newState2 = picklistReducer(newState1, addObject(item))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS.concat({
        marked: false,
        path: [],
        value: item
      })
    }
    assert.deepStrictEqual(newState2, expectedState, 'Object should be added')
  })

  it('Add object with path, adds object and path to object array', () => {
    const item = {
      id: 7777,
      mame: 'Some test object'
    }
    const path = [
      {
        id: 3345,
        name: 'Some node'
      },
      {
        id: 234,
        name: 'Some storage unit'
      }
    ]
    const newState = picklistReducer(testState, addObject(item, path))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS.concat({
        marked: false,
        path: path,
        value: item
      })
    }
    assert.deepStrictEqual(newState, expectedState, 'Object should be added')
  })

  it('Remove object, remove item from object array', () => {
    const newState = picklistReducer(testState, removeObject(object1))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: [
        {
          marked: false,
          path: [],
          value: object2
        }
      ]
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be removed')
  })

  it('Remove all object, remove all objects from object array', () => {
    const newState = picklistReducer(testState, removeObject([object1, object2]))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: []
    }
    assert.deepStrictEqual(newState, expectedState, 'Node should be removed')
  })

  it('Toggle node, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleNode([node2])) // lets try with brackets here
    const expectedState = {
      NODE: [
        {
          marked: false,
          path: [],
          value: node1
        },
        {
          marked: true,
          path: [],
          value: node2
        },
        {
          marked: false,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle node with on = true, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleNode([node2], true)) // lets try with brackets here
    const expectedState = {
      NODE: [
        {
          marked: false,
          path: [],
          value: node1
        },
        {
          marked: true,
          path: [],
          value: node2
        },
        {
          marked: false,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle node with on = false, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleNode([node2], false)) // lets try with brackets here
    const expectedState = {
      NODE: [
        {
          marked: false,
          path: [],
          value: node1
        },
        {
          marked: false,
          path: [],
          value: node2
        },
        {
          marked: false,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle all node, toggles items in the array', () => {
    const newState = picklistReducer(testState, toggleNode([node1, node2, node3]))
    const expectedState = {
      NODE: [
        {
          marked: true,
          path: [],
          value: node1
        },
        {
          marked: true,
          path: [],
          value: node2
        },
        {
          marked: true,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle object, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleObject(object1))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: [
        {
          marked: true,
          path: [],
          value: object1
        },
        {
          marked: false,
          path: [],
          value: object2
        }
      ]
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle object with on = true, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleObject(object1, true))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: [
        {
          marked: true,
          path: [],
          value: object1
        },
        {
          marked: false,
          path: [],
          value: object2
        }
      ]
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle object with on = false, toggles item in the array', () => {
    const newState = picklistReducer(testState, toggleObject(object1, false))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: [
        {
          marked: false,
          path: [],
          value: object1
        },
        {
          marked: false,
          path: [],
          value: object2
        }
      ]
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle all object, toggles items in the array', () => {
    const newState = picklistReducer(testState, toggleObject([object1, object2]))
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: [
        {
          marked: true,
          path: [],
          value: object1
        },
        {
          marked: true,
          path: [],
          value: object2
        }
      ]
    }
    assert.deepStrictEqual(newState, expectedState, 'Should mark item')
  })

  it('Toggle object without item, should still work but have no effect', () => {
    const newState = picklistReducer(testState, toggleObject())
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should not mark any item')
  })

  it('Toggle node without item, should still work but have no effect', () => {
    const newState = picklistReducer(testState, toggleNode())
    const expectedState = {
      NODE: DEFAULT_NODES,
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(newState, expectedState, 'Should not mark any item')
  })

  it('Refresh node updates path. Do not show root if only root is there.', () => {
    const newState = picklistReducer(testState, {
      type: LOAD_ONE_NODE_SUCCESS,
      result:{
        path: ',1,',
        pathNames: [{ nodeId: 1}] },
      id: 1
    })
    const expectedState =  {
      NODE: [
        {
          marked: false,
          path: [],
          value: node1
        },
        {
          marked: false,
          path: [],
          value: node2
        },
        {
          marked: false,
          path: [],
          value: node3
        }
      ],
      OBJECT: DEFAULT_OBJECTS
    }
    assert.deepStrictEqual(JSON.stringify(expectedState), JSON.stringify(newState), 'Should update path for node 1')
  })

it('Refresh node updates path. Will only show the second node. First(root) and last node(child) will not show.', () => {
  const newState = picklistReducer(testState, {
    type: LOAD_ONE_NODE_SUCCESS,
    result:{
      path: ',1,2,3,',
      pathNames: [{ nodeId: 1},{ nodeId: 2},{ nodeId: 3}]
    },
    id: 1
  })
  const expectedState =  {
    NODE: [
      {
        marked: false,
        path: [{id : 2, url: "/magasin/2"}],
        value: node1
      },
      {
        marked: false,
        path: [],
        value: node2
      },
      {
        marked: false,
        path: [],
        value: node3
      }
    ],
    OBJECT: DEFAULT_OBJECTS
  }
  assert.deepStrictEqual(JSON.stringify(expectedState), JSON.stringify(newState), 'Should update path for node 1')
})
})
