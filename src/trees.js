import _ from 'lodash';

const getDiffTree = (treeBefore, treeAfter) => {
  const keysBefore = Object.keys(treeBefore);
  const keysAfter = Object.keys(treeAfter);
  const keysUnion = _.union(keysBefore, keysAfter);

  const diffTree = keysUnion.map((key) => {
    if (!_.has(treeAfter, key)) {
      const value = _.cloneDeep(treeBefore[key]);
      const newNode = {
        name: key,
        value,
        type: 'removed',
      };

      return newNode;
    }

    if (!_.has(treeBefore, key)) {
      const value = _.cloneDeep(treeAfter[key]);
      const newNode = {
        name: key,
        value,
        type: 'added',
      };

      return newNode;
    }

    const valueBefore = _.cloneDeep(treeBefore[key]);
    const valueAfter = _.cloneDeep(treeAfter[key]);

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
        valueBefore,
        valueAfter,
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
