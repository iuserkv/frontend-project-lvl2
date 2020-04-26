import command from 'commander';
import _ from 'lodash';
import readFile from './utils.js';
import { parseFromJSON, parseFromYAML, parseFromINI } from './parsers.js';

// Генерирует список отличий двух объектов.
const genDiffOConfigs = (config1, config2) => {
  let result = '{\n';

  const keysOfCongig1 = Object.keys(config1);
  keysOfCongig1.forEach((key) => {
    if (_.has(config2, key)) {
      if (config2[key] === config1[key]) {
        result += `    ${key}: ${config1[key]}\n`;
      } else {
        result += `  + ${key}: ${config2[key]}\n`;
        result += `  - ${key}: ${config1[key]}\n`;
      }
    } else {
      result += `  - ${key}: ${config1[key]}\n`;
    }
  });

  const keysOfConfig2 = Object.keys(config2);
  keysOfConfig2.forEach((key) => {
    if (!_.has(config1, key)) {
      result += `  + ${key}: ${config2[key]}\n`;
    }
  });

  result += '}';

  return result;
};

// Генерирует список отличий в файлах.
const genDiff = (typeFiles, dataOfFile1, dataOfFile2) => {
  if (typeFiles === 'json') {
    const config1 = parseFromJSON(dataOfFile1);
    const config2 = parseFromJSON(dataOfFile2);

    return genDiffOConfigs(config1, config2);
  }

  if (typeFiles === 'yaml') {
    const config1 = parseFromYAML(dataOfFile1);
    const config2 = parseFromYAML(dataOfFile2);

    return genDiffOConfigs(config1, config2);
  }

  if (typeFiles === 'ini') {
    const config1 = parseFromINI(dataOfFile1);
    const config2 = parseFromINI(dataOfFile2);

    return genDiffOConfigs(config1, config2);
  }

  return '';
};

// Выводит на экран отличия в файлах.
const showDiff = (typeFiles, pathToFile1, pathToFile2) => {
  const dataOfFile1 = readFile(pathToFile1);
  const dataOfFile2 = readFile(pathToFile2);

  if (dataOfFile1 && dataOfFile2) {
    console.log(genDiff(typeFiles, dataOfFile1, dataOfFile2));
  }

  console.log('Failed to get data!');
};

// Принимает и обрабатывает параметры,
// переданные утилите при запуске.
const getDiff = (params) => {
  command
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format <type>', 'output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      showDiff(command.format, firstConfig, secondConfig);
    })
    .parse(params);
};

export { genDiffOConfigs, getDiff };
export default genDiff;
