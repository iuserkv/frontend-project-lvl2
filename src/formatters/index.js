import getStylishFormatedDiff from './stylish.js';
import getPlainFormatedDiff from './plain.js';
import getJSONFormatedDiff from './json.js';

const getFormatter = (formatter) => {
  if (formatter === 'stylish') {
    return getStylishFormatedDiff;
  }

  if (formatter === 'plain') {
    return getPlainFormatedDiff;
  }

  if (formatter === 'json') {
    return getJSONFormatedDiff;
  }

  return null;
};

export default getFormatter;
