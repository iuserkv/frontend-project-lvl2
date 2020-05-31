import path from 'path';
import fs from 'fs';
import { getParsedJSON, getParsedYAML, getParsedINI } from '../src/parsers.js';
import getDiffTree from '../src/trees.js';
import getStylishFormatedDiff from '../formatters/stylish.js';
import getPlainFormatedDiff from '../formatters/plain.js';
import getJSONFormatedDiff from '../formatters/json.js';
import { getDiff } from '../src/getdiff.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Вспомогательные функции
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тесты
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const parsedData = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

// Парсинг JSON-файла.
test('getParsedJSON', () => {
  const data = readFile('before.json');
  expect(getParsedJSON(data)).toEqual(parsedData);
});

// Парсинг YAML-файла.
test('getParsedYAML', () => {
  const data = readFile('before.yml');
  expect(getParsedYAML(data)).toEqual(parsedData);
});

// Парсинг INI-файла.
test('getParsedINI', () => {
  const data = readFile('before.ini');
  expect(getParsedINI(data)).toEqual(parsedData);
});

// Полное совпадение данных.
test('getDiff equal', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 20, host: 'hexlet.io' };
  const diffTree = getDiffTree(data1, data2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual('{\n    timeout: 20\n    host: hexlet.io\n}');
});

// Добавление данных.
test('getDiff add', () => {
  const data1 = { timeout: 20 };
  const data2 = { timeout: 20, proxy: '123.234.53.22' };
  const diffTree = getDiffTree(data1, data2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual('{\n    timeout: 20\n  + proxy: 123.234.53.22\n}');
});

// Удаление данных.
test('getDiff delete', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 20 };
  const diffTree = getDiffTree(data1, data2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual('{\n    timeout: 20\n  - host: hexlet.io\n}');
});

// Изменение данных.
test('getDiff change', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 50, host: 'hexlet.io' };
  const diffTree = getDiffTree(data1, data2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual('{\n  - timeout: 20\n  + timeout: 50\n    host: hexlet.io\n}');
});

// Полный тест "плоского" JSON с чтением данных из файлов.
test('getDiff JSON', () => {
  const dataOfFile1 = readFile('before.json');
  const dataOfFile2 = readFile('after.json');
  const requiredString = readFile('diff.txt');
  const diffTree = getDiff('.json', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест JSON со сложной структорой с чтением данных из файлов
// с форматированием в виде дерева.
test('getDiff JSON tree stylish', () => {
  const dataOfFile1 = readFile('before_tree.json');
  const dataOfFile2 = readFile('after_tree.json');
  const requiredString = readFile('diff_tree.txt');
  const diffTree = getDiff('.json', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест JSON со сложной структорой с чтением данных из файлов
// с форматирование в виде набора строка.
test('getDiff JSON tree plain', () => {
  const dataOfFile1 = readFile('before_tree.json');
  const dataOfFile2 = readFile('after_tree.json');
  const requiredString = readFile('diff_plain.txt');
  const diffTree = getDiff('.json', dataOfFile1, dataOfFile2);
  const diffString = getPlainFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест "плоского" YAML с чтением данных из файлов.
test('getDiff YAML', () => {
  const dataOfFile1 = readFile('before.yml');
  const dataOfFile2 = readFile('after.yml');
  const requiredString = readFile('diff.txt');
  const diffTree = getDiff('.yml', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест YAML со сложной структорой с чтением данных из файлов
// с форматированием в виде дерева.
test('getDiff YAML tree stylish', () => {
  const dataOfFile1 = readFile('before_tree.yml');
  const dataOfFile2 = readFile('after_tree.yml');
  const requiredString = readFile('diff_tree.txt');
  const diffTree = getDiff('.yml', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест YAML со сложной структорой с чтением данных из файлов
// с форматированием в виде набора строк.
test('getDiff YAML tree plain', () => {
  const dataOfFile1 = readFile('before_tree.yml');
  const dataOfFile2 = readFile('after_tree.yml');
  const requiredString = readFile('diff_plain.txt');
  const diffTree = getDiff('.yml', dataOfFile1, dataOfFile2);
  const diffString = getPlainFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест "плоского" INI с чтением данных из файлов.
test('getDiff INI', () => {
  const dataOfFile1 = readFile('before.ini');
  const dataOfFile2 = readFile('after.ini');
  const requiredString = readFile('diff.txt');
  const diffTree = getDiff('.ini', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест INI со сложной структорой с чтением данных из файлов
// с форматированием в виде дерева.
test('getDiff INI tree stylish', () => {
  const dataOfFile1 = readFile('before_tree.ini');
  const dataOfFile2 = readFile('after_tree.ini');
  const requiredString = readFile('diff_tree.txt');
  const diffTree = getDiff('.ini', dataOfFile1, dataOfFile2);
  const diffString = getStylishFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест INI со сложной структорой с чтением данных из файлов
// с форматированием в виде набора строк.
test('getDiff INI tree plain', () => {
  const dataOfFile1 = readFile('before_tree.ini');
  const dataOfFile2 = readFile('after_tree.ini');
  const requiredString = readFile('diff_plain.txt');
  const diffTree = getDiff('.ini', dataOfFile1, dataOfFile2);
  const diffString = getPlainFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});

// Полный тест со сложной структорой с чтением данных из файлов
// с форматированием JSON.
test('getDiff YAML tree json', () => {
  const dataOfFile1 = readFile('before_tree.json');
  const dataOfFile2 = readFile('after_tree.json');
  const requiredString = readFile('diff_json.txt');
  const diffTree = getDiff('.json', dataOfFile1, dataOfFile2);
  const diffString = getJSONFormatedDiff(diffTree);
  expect(diffString).toEqual(requiredString);
});
