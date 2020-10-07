import _ from 'lodash';

const getValue = (value) => (!_.isObject(value) ? value : '[complex value]');

const getPlainFormatedDiff = (diffTree) => {
  const getFormatedLines = (tree, parent) => {
    const ancestors = (parent === '') ? '' : `${parent}.`;

    const formatedLines = tree.map((node) => {
      const {
        name,
        value,
        valueBefore,
        valueAfter,
        type,
        children,
      } = { ...node };

      const fullName = `${ancestors}${name}`;

      switch (type) {
        case 'unchanged':
          return null;
        case 'removed':
          return `Property '${fullName}' was deleted`;
        case 'added':
          return `Property '${fullName}' was added with value: ${getValue(value)}`;
        case 'changed':
          return `Property '${fullName}' was changed from ${getValue(valueBefore)} to ${getValue(valueAfter)}`;
        case 'complexChanges':
          return getFormatedLines(children, fullName);
        default:
          throw new Error(`Unknown node type: '${type}'!`);
      }
    });

    return formatedLines;
  };

  const plainFormatedDiff = getFormatedLines(diffTree, '')
    .flat(Infinity)
    .filter((line) => line !== null)
    .join('\n');

  return plainFormatedDiff;
};

export default getPlainFormatedDiff;
