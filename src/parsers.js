// Парсит JSON файл.
const parseFromJSON = (data) => JSON.parse(data);

// Парсит YAML файл.
const parseFromYAML = (data) => {
  const parsedData = data.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0];
    acc[key] = value;
    return acc;
  }, {});

  return parsedData;
};

export { parseFromJSON, parseFromYAML };
