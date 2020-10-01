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
      const [childName, childValue] = [...child];
      return getFormatedLine(childName, childValue, '  ', `${newPadding}  `);
    }).join('\n'),
    `${padding}  }`,
  ].join('\n');
};

const getStylishFormatedDiff = (diffTree) => {
  const getFormatedLines = (tree, padding) => {
    const formatedLines = tree.map((node) => {
      const {
        name,
        value,
        valueBefore,
        valueAfter,
        type,
        children,
      } = { ...node };

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
        default: {
          const newPadding = `${padding}  `;

          return [
            `${newPadding}${name}: {`,
            `${getFormatedLines(children, `${newPadding}  `)}`,
            `${newPadding}}`,
          ].join('\n');
        }
      }
    });

    return formatedLines.join('\n');
  };

  return `{\n${getFormatedLines(diffTree, '  ')}\n}`;
};

export default getStylishFormatedDiff;
