import _ from 'lodash';

const getNewValue = (value) => {
  if (typeof value !== 'object') {
    return value;
  }

  const newValue = Object.entries(value).map((node) => {
    const [name, receivedValue] = [...node];

    if (typeof receivedValue !== 'object') {
      const newNode = {
        name,
        value: receivedValue,
        type: 'unchanged',
      };

      return newNode;
    }

    const newNode = {
      name,
      value: getNewValue(value),
      type: 'unchanged',
    };

    return newNode;
  });

  return newValue;
};

const getDiffTree = (treeBefore, treeAfter) => {
  const keysBefore = Object.keys(treeBefore);
  const keysAfter = Object.keys(treeAfter);
  const keysUnion = _.union(keysBefore, keysAfter);

  const diffTree = keysUnion.map((key) => {
    if (_.has(treeBefore, key) && !_.has(treeAfter, key)) {
      const value = _.get(treeBefore, key);
      const newValue = getNewValue(value);
      const newNode = {
        name: key,
        value: newValue,
        type: 'removed',
      };

      return newNode;
    }

    if (!_.has(treeBefore, key) && _.has(treeAfter, key)) {
      const value = _.get(treeAfter, key);
      const newValue = getNewValue(value);
      const newNode = {
        name: key,
        value: newValue,
        type: 'added',
      };

      return newNode;
    }

    const valueBefore = _.get(treeBefore, key);
    const valueAfter = _.get(treeAfter, key);

    if (_.isEqual(valueBefore, valueAfter)) {
      const newNode = {
        name: key,
        value: valueBefore,
        type: 'unchanged',
      };

      return newNode;
    }

    if ((typeof valueBefore !== 'object') || (typeof valueAfter !== 'object')) {
      const newNode = {
        name: key,
        valueBefore: getNewValue(valueBefore),
        valueAfter: getNewValue(valueAfter),
        type: 'changed',
      };

      return newNode;
    }

    const newNode = {
      name: key,
      value: getDiffTree(valueBefore, valueAfter),
      type: 'changed',
    };

    return newNode;
  });

  return diffTree;
};

export default getDiffTree;
