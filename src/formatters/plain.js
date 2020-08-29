import _ from 'lodash';

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

      if (type === 'removed') {
        return `Property '${ancestors}${name}' was deleted\n`;
      }

      if (type === 'added') {
        if (typeof value !== 'object') {
          return `Property '${ancestors}${name}' was added with value: ${value}\n`;
        }

        if (!_.isArray(value)) {
          return `Property '${ancestors}${name}' was added with value: [complex value]\n`;
        }

        return getFormatedLines(value, `${ancestors}${name}`);
      }

      if (type === 'changed') {
        if (value === undefined) {
          if (typeof valueBefore !== 'object') {
            if (typeof valueAfter !== 'object') {
              return `Property '${ancestors}${name}' was changed from ${valueBefore} to ${valueAfter}\n`;
            }

            return `Property '${ancestors}${name}' was changed from ${valueBefore} to [complex value]\n`;
          }

          if (typeof valueAfter !== 'object') {
            return `Property '${ancestors}${name}' was changed from [complex value] to ${valueAfter}\n`;
          }

          return `Property '${ancestors}${name}' was changed from [complex value] to [complex value]\n`;
        }

        return getFormatedLines(value, `${ancestors}${name}`);
      }

      return '';
    });

    return formatedLines;
  };

  const plainFormatedDiff = getFormatedLines(diffTree, '').flat(Infinity).join('');

  return plainFormatedDiff;
};

export default getPlainFormatedDiff;
