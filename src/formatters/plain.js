import _ from 'lodash';

const getValue = (value) => (!_.isObject(value) ? value : '[complex value]');

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
        children,
      } = { ...node };

      const fullName = `${ancestors}${name}`;

      if (type === 'removed') {
        return getFormatedLine(type, fullName);
      }

      if (type === 'added') {
        return getFormatedLine(type, fullName, getValue(value));
      }

      if (type === 'unchanged') {
        return '';
      }

      if (type === 'changed') {
        return getFormatedLine(type, fullName, value, getValue(valueBefore), getValue(valueAfter));
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
