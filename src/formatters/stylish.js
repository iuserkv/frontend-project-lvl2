import _ from 'lodash';

const getStylishFormatedDiff = (diffTree) => {
  const getStylishFormatedString = (tree, padding) => {
    const addPadding = '    ';

    const result = tree.reduce((diff, node) => {
      let accString = diff;

      if (node.type === 'unchanged') {
        if (!_.isObject(node.value)) {
          accString += `${padding}  ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}  ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      if (node.type === 'removed') {
        if (!_.isObject(node.value)) {
          accString += `${padding}- ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}- ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      if (node.type === 'added') {
        if (!_.isObject(node.value)) {
          accString += `${padding}+ ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}+ ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      if (node.type === 'changed') {
        if (_.has(node, 'value')) {
          accString += `${padding}  ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        } else {
          if (!_.isObject(node.valueBefore)) {
            accString += `${padding}- ${node.name}: ${node.valueBefore}\n`;
          } else {
            accString += `${padding}- ${node.name}: {\n`;
            accString += getStylishFormatedString(node.valueBefore, padding + addPadding);
            accString += `${padding}  }\n`;
          }

          if (!_.isObject(node.valueAfter)) {
            accString += `${padding}+ ${node.name}: ${node.valueAfter}\n`;
          } else {
            accString += `${padding}+ ${node.name}: {\n`;
            accString += getStylishFormatedString(node.valueAfter, padding + addPadding);
            accString += `${padding}  }\n`;
          }
        }
      }

      return accString;
    }, '');

    return result;
  };

  const padding = '  ';
  const stylishFormatedString = `{\n${getStylishFormatedString(diffTree, padding)}}`;

  return stylishFormatedString;
};

export default getStylishFormatedDiff;
