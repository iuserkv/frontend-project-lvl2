import _ from 'lodash';

const getDiffTree = (treeBefore, treeAfter) => {
  const keysBefore = Object.keys(treeBefore);
  const keysAfter = Object.keys(treeAfter);
  const keysUnion = _.union(keysBefore, keysAfter);

  const diffTree = keysUnion.map((key) => {
    if (!_.has(treeAfter, key)) {
      const value = treeBefore[key];
      const newNode = {
        name: key,
        value,
        type: 'removed',
      };

      return newNode;
    }

    if (!_.has(treeBefore, key)) {
      const value = treeAfter[key];
      const newNode = {
        name: key,
        value,
        type: 'added',
      };

      return newNode;
    }

    const valueBefore = treeBefore[key];
    const valueAfter = treeAfter[key];

    if (valueBefore === valueAfter) {
      const newNode = {
        name: key,
        value: valueBefore,
        type: 'unchanged',
      };

      return newNode;
    }

    if (!_.isObject(valueBefore) || !_.isObject(valueAfter)) {
      const newNode = {
        name: key,
        valueBefore,
        valueAfter,
        type: 'changed',
      };

      return newNode;
    }

    const newNode = {
      name: key,
      children: getDiffTree(valueBefore, valueAfter),
      type: 'complexChanges',
    };

    return newNode;
  });

  return diffTree;
};

export default getDiffTree;
