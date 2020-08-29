import _ from 'lodash';

const getFormatedLine = (type, name, value, prefix, depth) => {
  if (typeof value !== 'object') {
    if (type === 'unchanged') {
      return `${prefix.repeat(depth)}${name}: ${value}\n`;
    }

    if (type === 'removed') {
      return `${prefix.repeat(depth).slice(0, -2)}- ${name}: ${value}\n`;
    }

    if (type === 'added') {
      return `${prefix.repeat(depth).slice(0, -2)}+ ${name}: ${value}\n`;
    }

    return '';
  }

  if (!_.isArray(value)) {
    const subName = Object.entries(value).flat()[0];
    const subValue = Object.entries(value).flat()[1];

    if (type === 'unchanged') {
      return ''.concat(
        `${prefix.repeat(depth)}  ${name}: {\n`,
        `${prefix.repeat(depth + 1)}${subName}: ${subValue}\n`,
        `${prefix.repeat(depth)}}\n`,
      );
    }

    if (type === 'removed') {
      return ''.concat(
        `${prefix.repeat(depth).slice(0, -2)}- ${name}: {\n`,
        `${prefix.repeat(depth + 1)}${subName}: ${subValue}\n`,
        `${prefix.repeat(depth)}}\n`,
      );
    }

    if (type === 'added') {
      return ''.concat(
        `${prefix.repeat(depth).slice(0, -2)}+ ${name}: {\n`,
        `${prefix.repeat(depth + 1)}${subName}: ${subValue}\n`,
        `${prefix.repeat(depth)}}\n`,
      );
    }

    return '';
  }

  return '';
};

const getStylishFormatedDiff = (diffTree) => {
  const getFormatedLines = (tree, depth) => {
    const prefix = '    ';

    const formatedLines = tree.map((node) => {
      const {
        name,
        value,
        valueBefore,
        valueAfter,
        type,
      } = { ...node };

      if (value !== undefined) {
        if (!_.isArray(value)) {
          const formatedLine = getFormatedLine(type, name, value, prefix, depth);

          return formatedLine;
        }

        const formatedLine = ''.concat(
          `${prefix.repeat(depth)}${name}: {\n`,
          `${getFormatedLines(value, depth + 1)}`,
          `${prefix.repeat(depth)}}\n`,
        );

        return formatedLine;
      }

      const formatedLine = ''.concat(
        getFormatedLine('removed', name, valueBefore, prefix, depth),
        getFormatedLine('added', name, valueAfter, prefix, depth),
      );

      return formatedLine;
    });

    return formatedLines.join('');
  };

  const stylishFormatedDiff = ''.concat(
    '{\n',
    getFormatedLines(diffTree, 1),
    '}',
  );

  return stylishFormatedDiff;
};

export default getStylishFormatedDiff;
