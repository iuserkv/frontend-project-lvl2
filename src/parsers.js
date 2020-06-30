import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const getParsedJSON = (data) => JSON.parse(data);

const getParsedYAML = (data) => {
  const preparedData = yaml.safeLoad(data);

  if (!_.isArray(preparedData)) {
    return preparedData;
  }

  return preparedData.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0];
    acc[key] = value;

    return acc;
  }, {});
};

const getParsedINI = (data) => {
  const preparedData = Object.entries(ini.decode(data));

  const parseINI = (iniData) => iniData.reduce((acc, item) => {
    const [key, value] = [...item];
    // Убираем кавычки для чисел.
    if (typeof value === 'string') {
      acc[key] = Number.isNaN(+value) ? value : +value;

      return acc;
    }

    // Проходим по всем комплесным значениям.
    if ((_.isObject(value)) && (!_.isArray(value))) {
      acc[key] = parseINI(Object.entries(value));

      return acc;
    }

    acc[key] = value;

    return acc;
  }, {});

  const parsedData = parseINI(preparedData);

  return parsedData;
};

const parseData = (typeData, data) => {
  if (typeData === '.json') {
    return getParsedJSON(data);
  }

  if (typeData === '.yml') {
    return getParsedYAML(data);
  }

  if (typeData === '.ini') {
    return getParsedINI(data);
  }

  return null;
};

export default parseData;
