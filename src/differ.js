import program from 'commander';
import path from 'path';
import fs from 'fs';
import parseData from './parsers.js';
import getDiffTree from './trees.js';
import getFormatter from './formatters/index.js';

const fileExist = (pathToFile) => {
  try {
    fs.statSync(pathToFile);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }

  return true;
};

const readFile = (pathToFile) => {
  const fullPathToFile = path.resolve(pathToFile);

  const dataOfFile = fs.readFileSync(fullPathToFile, 'utf-8');
  if (!dataOfFile) {
    return null;
  }

  return dataOfFile;
};

const genDiff = (pathToFile1, pathToFile2, format = 'stylish') => {
  const typeFile = path.extname(pathToFile1);

  const data1 = readFile(pathToFile1);
  const data2 = readFile(pathToFile2);
  if (!data1 || !data2) {
    console.log('Failed to get data from files!');
    return null;
  }

  const parsedData1 = parseData(typeFile, data1);
  const parsedData2 = parseData(typeFile, data2);

  const diffTree = getDiffTree(parsedData1, parsedData2);
  if (diffTree === null) {
    console.log('The difference tree was not received!');
    return null;
  }

  const formatter = getFormatter(format);
  const diffString = formatter(diffTree);

  return diffString;
};

const showDiff = (params) => {
  program
    .version('1.0.0')
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [format]', 'output format [format]', 'stylish')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      if (getFormatter(program.format) === null) {
        console.log('Format undefined!');
        return;
      }

      if (!fileExist(firstConfig)) {
        console.log(`File '${firstConfig}' dosen't exist!`);
        return;
      }

      if (!fileExist(secondConfig)) {
        console.log(`File '${secondConfig}' dosen't exist!`);
        return;
      }

      console.log(genDiff(firstConfig, secondConfig, program.format));
    })
    .parse(params);
};

export { genDiff, showDiff };
