export const getPath = (pathStr, pathNames) => {
  const nodeIds = pathStr.slice(1, -1).split(',').slice(1).map(p => parseFloat(p));
  return nodeIds.map(nodeId => {
    const pathMatch = pathNames.find(e => e.nodeId === nodeId)
    return {
      id: pathMatch.nodeId,
      name: pathMatch.name,
      url: '/magasin/' + pathMatch.nodeId
    }
  })
}
