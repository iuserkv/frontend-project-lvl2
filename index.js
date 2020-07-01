import path from 'path';
import fs from 'fs';
import parseData from './src/parsers.js';
import getDiffTree from './src/trees.js';
import getFormatter from './src/formatters/index.js';

const readFile = (pathToFile) => {
  const fullPathToFile = path.resolve(pathToFile);
  const dataOfFile = fs.readFileSync(fullPathToFile, 'utf-8');

  return dataOfFile;
};

const genDiff = (pathToFile1, pathToFile2, format = 'stylish') => {
  const typeFile = path.extname(pathToFile1);

  const data1 = readFile(pathToFile1);
  const data2 = readFile(pathToFile2);

  const parsedData1 = parseData(typeFile, data1);
  const parsedData2 = parseData(typeFile, data2);

  const diffTree = getDiffTree(parsedData1, parsedData2);

  const getFormattedDiff = getFormatter(format);
  const formattedDiff = getFormattedDiff(diffTree);

  return formattedDiff;
};

export default genDiff;
