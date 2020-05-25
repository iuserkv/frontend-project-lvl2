import _ from 'lodash';

// Возвращает имя узла node.
const getNodeName = (node) => node[0];

// Возвращает значение узла node.
const getNodeValue = (node) => node[1];

// Создает узел дерева различий.
const makeNode = (name, value, type) => {
  switch (type) {
    case 'unchanged':
      return { name, value, type: 'unchanged' };
    case 'removed':
      return { name, value, type: 'removed' };
    case 'added':
      return { name, value, type: 'added' };
    default:
      return null;
  }
};

// Преобразует узел дерева исходного формата в узел дерева различий.
const convertNode = (tree, type) => {
  // Если tree состоит из одного узла [name, {value}].
  if (tree.length === 2) {
    const name = getNodeName(tree);
    const value = getNodeValue(tree);

    // Если листовой узел.
    if (!_.isObject(value)) {
      return makeNode(name, value, type);
    }

    // Если внутренний узел.
    return makeNode(name, convertNode(value, 'unchanged'), type);
  }

  // Если tree сосотоит из множества узлов [[name, value], [name, {value}], ...].
  const convertedTree = [];

  const preparedTree = Object.entries(tree);

  preparedTree.forEach((node) => {
    const name = getNodeName(node);
    const value = getNodeValue(node);

    // Если листовой узел.
    if (!_.isObject(value)) {
      const convertedNode = makeNode(name, value, 'unchanged');
      convertedTree.push(convertedNode);
    // Если внутреннийз узел.
    } else {
      const convertedNode = makeNode(name, convertNode(value, 'unchanged'), 'unchanged');
      convertedTree.push(convertedNode);
    }
  });

  return convertedTree;
};

// Возвращает узел дерева различий, с типом 'changed'.
const makeChangedNode = (name, oldValue, newValue) => {
  let beforeValue;
  let afterValue;

  if (!_.isObject(oldValue)) {
    beforeValue = oldValue;
  } else {
    beforeValue = [convertNode(Object.entries(oldValue)[0], 'unchanged')];
  }

  if (!_.isObject(newValue)) {
    afterValue = newValue;
  } else {
    afterValue = [convertNode(Object.entries(newValue)[0], 'unchanged')];
  }

  return {
    name,
    beforeValue,
    afterValue,
    type: 'changed',
  };
};

// Возвращает дерево различий между деревьями oldTree и newTree.
const getDiffTree = (oldTree, newTree) => {
  const makeDiffTree = (tree1, tree2, tmpTree) => {
    const diffTree = [...tmpTree];

    const beforeTree = Object.entries(tree1);
    const afterTree = Object.entries(tree2);

    // Добавить узлы, имеющиеся в обоих деревьях.
    for (let i = 0; i < beforeTree.length; i += 1) {
      const beforeNode = beforeTree[i];
      const beforeNodeName = getNodeName(beforeNode);
      const beforeNodeValue = getNodeValue(beforeNode);

      let isMatch = false;
      for (let j = 0; j < afterTree.length; j += 1) {
        const afterNode = afterTree[j];

        if (afterNode !== undefined) {
          const afterNodeName = getNodeName(afterNode);
          const afterNodeValue = getNodeValue(afterNode);

          if (beforeNodeName === afterNodeName) {
            isMatch = true;

            if (_.isEqual(beforeNodeValue, afterNodeValue)) {
              const diffNode = makeNode(beforeNodeName, beforeNodeValue, 'unchanged');
              diffTree.push(diffNode);
            } else if (!_.isObject(beforeNodeValue) || !_.isObject(afterNodeValue)) {
              const diffNode = makeChangedNode(beforeNodeName, beforeNodeValue, afterNodeValue);
              diffTree.push(diffNode);
            } else {
              const diffNode = {
                name: beforeNodeName,
                value: makeDiffTree(beforeNodeValue, afterNodeValue, []),
                type: 'changed',
              };
              diffTree.push(diffNode);
            }

            delete afterTree[j];
          }
        }
      }

      if (isMatch) {
        delete beforeTree[i];
      }
    }

    // Добавить удаленные узлы.
    beforeTree.forEach((node) => {
      if (node !== undefined) {
        const diffNode = convertNode(node, 'removed');
        diffTree.push(diffNode);
      }
    });

    // Добавить новые узлы.
    afterTree.forEach((node) => {
      if (node !== undefined) {
        const diffNode = convertNode(node, 'added');
        diffTree.push(diffNode);
      }
    });

    return diffTree;
  };

  const diffTree = makeDiffTree(oldTree, newTree, []);

  return diffTree;
};

// Преобразует дерево различий diffTree в отформатированную строку.
const stylish = (diffTree) => {
  const getDifferences = (tree, padding) => {
    const addPadding = '    ';

    const fullDiff = tree.reduce((diff, node) => {
      let newDiff = diff;

      if (node.type === 'unchanged') {
        if (!_.isObject(node.value)) {
          newDiff += `${padding}  ${node.name}: ${node.value}\n`;
        } else {
          newDiff += `${padding}  ${node.name}: {\n`;
          newDiff += getDifferences(node.value, padding + addPadding);
          newDiff += `${padding}  }\n`;
        }

        return newDiff;
      }

      if (node.type === 'removed') {
        if (!_.isObject(node.value)) {
          newDiff += `${padding}- ${node.name}: ${node.value}\n`;
        } else {
          newDiff += `${padding}- ${node.name}: {\n`;
          newDiff += getDifferences(node.value, padding + addPadding);
          newDiff += `${padding}  }\n`;
        }

        return newDiff;
      }

      if (node.type === 'added') {
        if (!_.isObject(node.value)) {
          newDiff += `${padding}+ ${node.name}: ${node.value}\n`;
        } else {
          newDiff += `${padding}+ ${node.name}: {\n`;
          newDiff += getDifferences(node.value, padding + addPadding);
          newDiff += `${padding}  }\n`;
        }

        return newDiff;
      }

      if (node.type === 'changed') {
        if (_.has(node, 'value')) {
          newDiff += `${padding}  ${node.name}: {\n`;
          newDiff += getDifferences(node.value, padding + addPadding);
          newDiff += `${padding}  }\n`;
        } else {
          if (!_.isObject(node.beforeValue)) {
            newDiff += `${padding}- ${node.name}: ${node.beforeValue}\n`;
          } else {
            newDiff += `${padding}- ${node.name}: {\n`;
            newDiff += getDifferences(node.beforeValue, padding + addPadding);
            newDiff += `${padding}  }\n`;
          }

          if (!_.isObject(node.afterValue)) {
            newDiff += `${padding}+ ${node.name}: ${node.afterValue}\n`;
          } else {
            newDiff += `${padding}+ ${node.name}: {\n`;
            newDiff += getDifferences(node.afterValue, padding + addPadding);
            newDiff += `${padding}  }\n`;
          }
        }

        return newDiff;
      }

      return newDiff;
    }, '');

    return fullDiff;
  };

  const padding = '  ';
  const diffString = `{\n${getDifferences(diffTree, padding)}}`;

  return diffString;
};

export { getDiffTree, stylish };
