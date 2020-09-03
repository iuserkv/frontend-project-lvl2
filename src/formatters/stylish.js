import _ from 'lodash';

const getFormatedLine = (type, name, value, prefix, depth) => {
  if (!_.isObject(value)) {
    if (type === 'unchanged') {
      return `${prefix.repeat(depth)}${name}: ${value}`;
    }

    if (type === 'removed') {
      return `${prefix.repeat(depth).slice(0, -2)}- ${name}: ${value}`;
    }

    if (type === 'added') {
      return `${prefix.repeat(depth).slice(0, -2)}+ ${name}: ${value}`;
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
        `${prefix.repeat(depth)}}`,
      );
    }

    if (type === 'removed') {
      return ''.concat(
        `${prefix.repeat(depth).slice(0, -2)}- ${name}: {\n`,
        `${prefix.repeat(depth + 1)}${subName}: ${subValue}\n`,
        `${prefix.repeat(depth)}}`,
      );
    }

    if (type === 'added') {
      return ''.concat(
        `${prefix.repeat(depth).slice(0, -2)}+ ${name}: {\n`,
        `${prefix.repeat(depth + 1)}${subName}: ${subValue}\n`,
        `${prefix.repeat(depth)}}`,
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
          return getFormatedLine(type, name, value, prefix, depth);
        }

        const formatedLine = [];
        formatedLine.push(`${prefix.repeat(depth)}${name}: {`);
        formatedLine.push(`${getFormatedLines(value, depth + 1)}`);
        formatedLine.push(`${prefix.repeat(depth)}}`);

        return formatedLine.join('\n');
      }

      const formatedLine = [];
      formatedLine.push(getFormatedLine('removed', name, valueBefore, prefix, depth));
      formatedLine.push(getFormatedLine('added', name, valueAfter, prefix, depth));

      return formatedLine.join('\n');
    });

    return formatedLines.join('\n');
  };

  const stylishFormatedDiff = `{\n${getFormatedLines(diffTree, 1)}\n}`;

  return stylishFormatedDiff;
};

export default getStylishFormatedDiff;
