import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const getParsedINI = (data) => {
  const preparedData = Object.entries(ini.decode(data));

  const parseINI = (iniData) => iniData.reduce((acc, item) => {
    const [key, value] = [...item];
    // Убираем кавычки для чисел.
    if (_.isString(value)) {
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
  switch (typeData) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.safeLoad(data);
    case 'ini':
      return getParsedINI(data);
    default:
      throw new Error(`Unknown data type: ${typeData}`);
  }
};

export default parseData;
