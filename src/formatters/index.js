import getStylishFormatedDiff from './stylish.js';
import getPlainFormatedDiff from './plain.js';
import getJSONFormatedDiff from './json.js';

const getFormatter = (formatter) => {
  switch (formatter) {
    case 'stylish':
      return getStylishFormatedDiff;
    case 'plain':
      return getPlainFormatedDiff;
    case 'json':
      return getJSONFormatedDiff;
    default:
      throw new Error('Unknown format type!');
  }
};

export default getFormatter;
