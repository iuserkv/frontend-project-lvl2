import _ from 'lodash';

const getPlainFormatedDiff = (diffTree) => {
  const getPlainFormatedString = (tree, parentName, accString) => {
    let result = accString;

    // Передан узел.
    if (!_.isArray(tree)) {
      const { name, value, type } = { ...tree };

      let property;

      if (parentName !== '') {
        property = `${parentName}.${name}`;
      } else {
        property = `${name}`;
      }

      // Узел изменен.
      if (type === 'changed') {
        let valueBefore;
        let valueAfter;

        if (!_.isArray(value)) {
          if (!_.isObject(tree.valueBefore)) {
            valueBefore = tree.valueBefore;
          } else {
            valueBefore = '[complex value]';
          }

          if (!_.isObject(tree.valueAfter)) {
            valueAfter = tree.valueAfter;
          } else {
            valueAfter = '[complex value]';
          }

          result += `Property '${property}' was changed from ${valueBefore} to ${valueAfter}\n`;
        } else {
          result += getPlainFormatedString(value, property, accString);
        }
      }

      // Узел удален.
      if (type === 'removed') {
        result += `Property '${property}' was deleted\n`;
      }

      // Узел добавлен.
      if (type === 'added') {
        if (!_.isObject(value)) {
          result += `Property '${property}' was added with value: ${value}\n`;
        } else {
          result += `Property '${property}' was added with value: [complex value]\n`;
        }
      }
    // Передано дерево.
    } else {
      tree.forEach((node) => {
        result += getPlainFormatedString(node, parentName, accString);
      });
    }

    return result;
  };

  const PlainFormatedString = getPlainFormatedString(diffTree, '', '');

  return PlainFormatedString;
};

export default getPlainFormatedDiff;
