import command from 'commander';
// import _ from 'lodash';
import readFile from './utils.js';
import { getParsedJSON, getParsedYAML, getParsedINI } from './parsers.js';
import { getDiffTree, stylish } from './trees.js';

// Возвращает отформатированную строку отличий в файлах.
const getDiff = (typeFiles, dataOfFile1, dataOfFile2) => {
  switch (typeFiles) {
    case 'json': {
      const config1 = getParsedJSON(dataOfFile1);
      const config2 = getParsedJSON(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    case 'yaml': {
      const config1 = getParsedYAML(dataOfFile1);
      const config2 = getParsedYAML(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    case 'ini': {
      const config1 = getParsedINI(dataOfFile1);
      const config2 = getParsedINI(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    default:
      return null;
  }
};

// Выводит на экран отличия в файлах.
const showDiff = (typeFiles, formatter, pathToFile1, pathToFile2) => {
  const dataOfFile1 = readFile(pathToFile1);
  const dataOfFile2 = readFile(pathToFile2);

  if (dataOfFile1 && dataOfFile2) {
    const diffTree = getDiff(typeFiles, dataOfFile1, dataOfFile2);
    if (formatter === 'stylish') {
      const diffString = stylish(diffTree);
      console.log(diffString);
    } else {
      console.log('');
    }
  } else {
    console.log('Failed to get data!');
  }
};

// Точка входа.
const genDiff = (params) => {
  command
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format <type>', 'output format')
    .option('-s, --style <style>', 'output information formatting style', 'stylish')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      showDiff(command.format, command.style, firstConfig, secondConfig);
    })
    .parse(params);
};

export { getDiff };
export default genDiff;
