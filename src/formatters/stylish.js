import _ from 'lodash';

const getFormatedLine = (name, value, prefix, padding) => {
  if (!_.isObject(value)) {
    return `${padding}${prefix}${name}: ${value}`;
  }

  const node = Object.entries(value);
  const newPadding = `${padding}  `;

  return [
    `${padding}${prefix}${name}: {`,
    node.map((child) => {
      const [childName, childValue] = child;
      return getFormatedLine(childName, childValue, '  ', `${newPadding}  `);
    }).join('\n'),
    `${padding}  }`,
  ].join('\n');
};

const getStylishFormatedDiff = (diffTree) => {
  const getFormatedLines = (tree, depth) => {
    const formatedLines = tree.map((node) => {
      const placeholder = '  ';

      const {
        name,
        value,
        valueBefore,
        valueAfter,
        type,
        children,
      } = { ...node };

      const padding = placeholder.repeat(depth * 2 - 1);

      switch (type) {
        case 'unchanged':
          return getFormatedLine(name, value, '  ', padding);
        case 'removed':
          return getFormatedLine(name, value, '- ', padding);
        case 'added':
          return getFormatedLine(name, value, '+ ', padding);
        case 'changed': {
          return [
            `${getFormatedLine(name, valueBefore, '- ', padding)}`,
            `${getFormatedLine(name, valueAfter, '+ ', padding)}`,
          ].join('\n');
        }
        case undefined: {
          const newPadding = `${padding}  `;

          return [
            `${newPadding}${name}: {`,
            `${getFormatedLines(children, depth + 1)}`,
            `${newPadding}}`,
          ].join('\n');
        }
        default: {
          return null;
        }
      }
    });

    return formatedLines
      .filter((line) => line !== null)
      .join('\n');
  };

  const stylishFormatedDiff = `{\n${getFormatedLines(diffTree, 1)}\n}`;

  return stylishFormatedDiff;
};

export default getStylishFormatedDiff;
