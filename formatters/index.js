import getStylishFormatedDiff from './stylish.js';
import getPlainFormatedDiff from './plain.js';

// Возвращает форматтер.
const getFormatter = (formatter) => {
  if (formatter === 'stylish') {
    return getStylishFormatedDiff;
  }

  if (formatter === 'plain') {
    return getPlainFormatedDiff;
  }

  return null;
};

export default getFormatter;
