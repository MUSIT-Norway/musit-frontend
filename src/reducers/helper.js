export const getPath = (node) => {
  const nodeIds = (node.path != null ? node.path : '').split(',').slice(1).map(p => parseFloat(p)).filter(n => n);
  const pathNames = node.pathNames || [{
    nodeId: node.id,
    name: node.name
  }];
  return nodeIds.map(nodeId => {
    let pathMatch = pathNames.find(e => e.nodeId === nodeId);
    if (!pathMatch) {
      pathMatch = {
        nodeId: node.id,
        name: node.name
      };
    }
    return {
      id: pathMatch.nodeId,
      name: pathMatch.name,
      url: '/magasin/' + pathMatch.nodeId
    };
  });
};