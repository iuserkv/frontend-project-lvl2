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

      if (type === 'removed') {
        return `Property '${fullName}' was deleted`;
      }

      if (type === 'added') {
        return `Property '${fullName}' was added with value: ${getValue(value)}`;
      }

      if (type === 'unchanged') {
        return '';
      }

      if (type === 'changed') {
        return `Property '${fullName}' was changed from ${getValue(valueBefore)} to ${getValue(valueAfter)}`;
      }

      return getFormatedLines(children, fullName);
    });

    return formatedLines;
  };

  const plainFormatedDiff = getFormatedLines(diffTree, '')
    .flat(Infinity)
    .filter((line) => line !== '')
    .join('\n');

  return plainFormatedDiff;
};

export default getPlainFormatedDiff;
