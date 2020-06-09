import _ from 'lodash';

// Возвращает дерево различий (diffTree) в
// виде отформатированой строки (как дерево).
const getStylishFormatedDiff = (diffTree) => {
  const getStylishFormatedString = (tree, padding) => {
    const addPadding = '    ';

    const result = tree.reduce((diff, node) => {
      let accString = diff;

      // Узел не изменен.
      if (node.type === 'unchanged') {
        if (!_.isObject(node.value)) {
          accString += `${padding}  ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}  ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      // Узел удален.
      if (node.type === 'removed') {
        if (!_.isObject(node.value)) {
          accString += `${padding}- ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}- ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      // Узел добавлен.
      if (node.type === 'added') {
        if (!_.isObject(node.value)) {
          accString += `${padding}+ ${node.name}: ${node.value}\n`;
        } else {
          accString += `${padding}+ ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        }
      }

      // Узел изменен.
      if (node.type === 'changed') {
        if (_.has(node, 'value')) {
          accString += `${padding}  ${node.name}: {\n`;
          accString += getStylishFormatedString(node.value, padding + addPadding);
          accString += `${padding}  }\n`;
        } else {
          if (!_.isObject(node.beforeValue)) {
            accString += `${padding}- ${node.name}: ${node.beforeValue}\n`;
          } else {
            accString += `${padding}- ${node.name}: {\n`;
            accString += getStylishFormatedString(node.beforeValue, padding + addPadding);
            accString += `${padding}  }\n`;
          }

          if (!_.isObject(node.afterValue)) {
            accString += `${padding}+ ${node.name}: ${node.afterValue}\n`;
          } else {
            accString += `${padding}+ ${node.name}: {\n`;
            accString += getStylishFormatedString(node.afterValue, padding + addPadding);
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
