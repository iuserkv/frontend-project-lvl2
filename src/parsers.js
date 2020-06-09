import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

// Парсер JSON-файлов.
const getParsedJSON = (data) => JSON.parse(data);

// Парсер YAML-файлов.
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

// Парсер INI-файлов.
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

export { getParsedJSON, getParsedYAML, getParsedINI };
