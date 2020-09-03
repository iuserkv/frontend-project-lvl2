import _ from 'lodash';

const getFormatedLine = (type, name, value, valueBefore, valueAfter) => {
  if (type === 'removed') {
    return `Property '${name}' was deleted`;
  }

  if (type === 'added') {
    return `Property '${name}' was added with value: ${value}`;
  }

  if (type === 'changed') {
    return `Property '${name}' was changed from ${valueBefore} to ${valueAfter}`;
  }

  return '';
};

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
      } = { ...node };

      const fullName = `${ancestors}${name}`;

      if (value !== undefined) {
        if (!_.isObject(value)) {
          return getFormatedLine(type, fullName, value);
        }

        if (!_.isArray(value)) {
          return getFormatedLine(type, fullName, '[complex value]');
        }

        return getFormatedLines(value, fullName);
      }

      const before = !_.isObject(valueBefore) ? valueBefore : '[complex value]';
      const after = !_.isObject(valueAfter) ? valueAfter : '[complex value]';

      return getFormatedLine(type, fullName, value, before, after);
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
