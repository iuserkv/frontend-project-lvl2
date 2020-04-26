import yaml from 'js-yaml';
import ini from 'ini';

// Парсит JSON файл.
const parseFromJSON = (data) => JSON.parse(data);

// Парсит YAML файл.
const parseFromYAML = (data) => {
  const parsedData = yaml.safeLoad(data);

  const preparedData = parsedData.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0];
    acc[key] = value;
    return acc;
  }, {});

  return preparedData;
};

// Парсит INI файл.
const parseFromINI = (data) => {
  const parsedData = ini.parse(data);

  const propeties = Object.entries(parsedData);

  const preparedData = propeties.reduce((acc, property) => {
    const [key, value] = [...property];
    // Если value имеет тип "строка" и
    // его можно преобразовать в число,
    // преобразуем
    if (typeof value === 'string') {
      acc[key] = Number.isNaN(+value) ? value : +value;
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});

  return preparedData;
};

export { parseFromJSON, parseFromYAML, parseFromINI };
