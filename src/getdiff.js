import command from 'commander';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import fileExist from './utils.js';
import { parseFromJSON, parseFromYAML } from './parsers.js';

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

// Генерирует список отличий в файлах формата JSON.
const genDiffJSON = (pathToFile1, pathToFile2) => {
  const file1Data = fs.readFileSync(pathToFile1, 'utf-8');
  const config1 = parseFromJSON(file1Data);

  const file2Data = fs.readFileSync(pathToFile2, 'utf-8');
  const config2 = parseFromJSON(file2Data);

  return genDiffOConfigs(config1, config2);
};

// Генерирует список отличий в файлах формата YAML.
const genDiffYAML = (pathToFile1, pathToFile2) => {
  const file1Data = fs.readFileSync(pathToFile1, 'utf-8');
  const config1YAML = yaml.safeLoad(file1Data);
  const config1 = parseFromYAML(config1YAML);

  const file2Data = fs.readFileSync(pathToFile2, 'utf-8');
  const config2YAML = yaml.safeLoad(file2Data);
  const config2 = parseFromYAML(config2YAML);

  return genDiffOConfigs(config1, config2);
};

// Генерирует список отличий в файлах.
const genDiff = (typeFiles, pathToFile1, pathToFile2) => {
  if (typeFiles === 'json') {
    return genDiffJSON(pathToFile1, pathToFile2);
  }

  if (typeFiles === 'yaml') {
    return genDiffYAML(pathToFile1, pathToFile2);
  }

  return '';
};

// Выводит на экран отличия в файлах.
const showDiff = (typeFiles, pathToFile1, pathToFile2) => {
  const absPathToFile1 = path.resolve(pathToFile1);
  if (!fileExist(absPathToFile1)) {
    console.log(`File ${absPathToFile1} is not exist!`);
    return;
  }

  const absPathToFile2 = path.resolve(pathToFile2);
  if (!fileExist(absPathToFile2)) {
    console.log(`File ${absPathToFile2} is not exist!`);
    return;
  }

  const diff = genDiff(typeFiles, pathToFile1, pathToFile2);

  console.log(diff);
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
