import _ from 'lodash';

const getFormatedLine = (name, value, prefix, padding) => {
  if (!_.isObject(value)) {
    return `${padding}${prefix}${name}: ${value}`;
  }

  const subName = Object.entries(value).flat()[0];
  const subValue = Object.entries(value).flat()[1];

  const formatedLine = [
    `${padding}${prefix}${name}: {`,
    `${padding}      ${subName}: ${subValue}`,
    `${padding}  }`,
  ];

  return formatedLine.join('\n');
};

const getStylishFormatedDiff = (diffTree) => {
  const getFormatedLines = (tree, depth) => {
    const formatedLines = tree.map((node) => {
      const {
        name,
        value,
        valueBefore,
        valueAfter,
        type,
        children,
      } = { ...node };

      const placeholder = '  ';
      const padding = placeholder.repeat(depth * 2 - 1);

      if (type === 'unchanged') {
        return getFormatedLine(name, value, '  ', padding);
      }

      if (type === 'removed') {
        return getFormatedLine(name, value, '- ', padding);
      }

      if (type === 'added') {
        return getFormatedLine(name, value, '+ ', padding);
      }

      if (type === 'changed') {
        const changedLines = [
          `${getFormatedLine(name, valueBefore, '- ', padding)}`,
          `${getFormatedLine(name, valueAfter, '+ ', padding)}`,
        ];

        return changedLines.join('\n');
      }

      const nextPadding = placeholder.repeat(depth * 2);

      const childrenLines = [
        `${nextPadding}${name}: {`,
        `${getFormatedLines(children, depth + 1)}`,
        `${nextPadding}}`,
      ];

      return childrenLines.join('\n');
    });

    return formatedLines.join('\n');
  };

  const stylishFormatedDiff = `{\n${getFormatedLines(diffTree, 1)}\n}`;

  return stylishFormatedDiff;
};

export default getStylishFormatedDiff;
