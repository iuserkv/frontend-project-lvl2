const getConvertedData = (tree) => {
  const convertedTree = Object.entries(tree).map((node) => {
    const name = node[0];
    const value = node[1];

    if (typeof value !== 'object') {
      return { name, value, type: 'unchanged' };
    }

    return { name, value: getConvertedData(value), type: 'unchanged' };
  });

  return convertedTree;
};

const getNodeByName = (tree, nodeName) => tree.filter((node) => node.name === nodeName)[0];

const isLeafNode = (node) => typeof node.value !== 'object';

const getTreeMarkedRemNodes = (firstTree, secondTree) => {
  const treeMarkedRemNodes = firstTree.map((node) => {
    const { name, value } = { ...node };

    const findedNode = getNodeByName(secondTree, name);

    if (findedNode === undefined) {
      const removedNode = { ...node, type: 'removed' };

      return removedNode;
    }

    if (findedNode.value === value) {
      const unchangedNode = { ...node, type: 'unchanged' };

      return unchangedNode;
    }

    if (isLeafNode(findedNode) || isLeafNode(node)) {
      const changedNode = { ...node, type: 'changed' };

      return changedNode;
    }

    const changedNode = {
      name,
      value: getTreeMarkedRemNodes(value, findedNode.value),
      type: 'changed',
    };

    return changedNode;
  });

  return treeMarkedRemNodes;
};

const getTreeMarkedAddChgNodes = (firstTree, secondTree) => {
  const treeMarkedAddChgNodes = secondTree.reduce((acc, node) => {
    const { name, value } = { ...node };

    const findedNode = getNodeByName(firstTree, name);

    if (findedNode === undefined) {
      const addedNode = { ...node, type: 'added' };
      acc.push(addedNode);

      return acc;
    }

    if (findedNode.value === value) {
      const unchangedNode = { ...findedNode, type: 'unchanged' };
      const newAcc = acc.filter((newNode) => newNode.name !== name);
      newAcc.push(unchangedNode);

      return newAcc;
    }

    if (isLeafNode(findedNode) || isLeafNode(node)) {
      const changedNode = {
        name,
        beforeValue: findedNode.value,
        afterValue: node.value,
        type: 'changed',
      };
      const newAcc = acc.filter((newNode) => newNode.name !== name);
      newAcc.push(changedNode);

      return newAcc;
    }

    const changedNode = {
      name,
      value: getTreeMarkedAddChgNodes(findedNode.value, value),
      type: 'changed',
    };
    const newAcc = acc.filter((newNode) => newNode.name !== name);
    newAcc.push(changedNode);

    return newAcc;
  }, firstTree);

  return treeMarkedAddChgNodes;
};

const getDiffTree = (dataBefore, dataAfter) => {
  const convertedDataBefore = getConvertedData(dataBefore);
  const convertedDataAfter = getConvertedData(dataAfter);

  const treeMarkedRemNodes = getTreeMarkedRemNodes(convertedDataBefore, convertedDataAfter);
  const diffData = getTreeMarkedAddChgNodes(treeMarkedRemNodes, convertedDataAfter);

  return diffData;
};

export default getDiffTree;
