import command from 'commander';
import path from 'path';
import readFile from './utils.js';
import { getParsedJSON, getParsedYAML, getParsedINI } from './parsers.js';
import getDiffTree from './trees.js';
import getFormatter from './formatters/index.js';

// Возвращает дерево различий в конфигурационных файлах
// указанного типа.
const getDiffTreeConfigs = (typeFiles, dataOfFile1, dataOfFile2) => {
  switch (typeFiles) {
    case '.json': {
      const config1 = getParsedJSON(dataOfFile1);
      const config2 = getParsedJSON(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    case '.yml': {
      const config1 = getParsedYAML(dataOfFile1);
      const config2 = getParsedYAML(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    case '.ini': {
      const config1 = getParsedINI(dataOfFile1);
      const config2 = getParsedINI(dataOfFile2);
      const diffTree = getDiffTree(config1, config2);

      return diffTree;
    }
    default:
      return null;
  }
};

// Возвращает дерево различий diffTree в виде отформатированной строки.
const genDiff = (diffTree, formatter) => formatter(diffTree);

// Выводит на экран отличия в файлах.
const showDiff = (typeFormat, pathToFile1, pathToFile2) => {
  const typeFile1 = path.extname(pathToFile1);
  const typeFile2 = path.extname(pathToFile2);

  if (typeFile1 !== typeFile2) {
    console.log('The type of files to compare must be the same!');
    return;
  }

  const dataOfFile1 = readFile(pathToFile1);
  const dataOfFile2 = readFile(pathToFile2);

  if (!dataOfFile1 || !dataOfFile2) {
    console.log('Failed to get data!');
    return;
  }

  const diffTree = getDiffTreeConfigs(typeFile1, dataOfFile1, dataOfFile2);
  if (diffTree === null) {
    console.log('The difference tree was not received!');
    return;
  }

  const formatter = getFormatter(typeFormat);
  if (formatter === null) {
    console.log('Failed to get the formatter!');
    return;
  }

  const formattedDiffString = genDiff(diffTree, formatter);
  console.log(formattedDiffString);
};

// Обработавыает параметры командной строки
// и выполняет соответствующие действия.
const processCommands = (params) => {
  command
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [format]', 'output format [format]', 'stylish')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      showDiff(command.format, firstConfig, secondConfig);
    })
    .parse(params);
};

export { genDiff, getDiffTreeConfigs, processCommands };
