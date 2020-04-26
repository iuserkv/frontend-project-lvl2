import path from 'path';
import fs from 'fs';
import genDiff, { genDiffOConfigs } from '../src/getdiff.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Вспомогательные функции
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тесты
// ++++++++++++++++++++++++++++++++++++++++++++++++++

// Полное совпадение данных.
test('genDiffOConfigs equal', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 20, host: 'hexlet.io' };
  expect(genDiffOConfigs(data1, data2)).toEqual('{\n    timeout: 20\n    host: hexlet.io\n}');
});

// Добавление данных.
test('genDiffOConfigs add', () => {
  const data1 = { timeout: 20 };
  const data2 = { timeout: 20, proxy: '123.234.53.22' };
  expect(genDiffOConfigs(data1, data2)).toEqual('{\n    timeout: 20\n  + proxy: 123.234.53.22\n}');
});

// Удаление данных.
test('genDiffOConfigs delete', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 20 };
  expect(genDiffOConfigs(data1, data2)).toEqual('{\n    timeout: 20\n  - host: hexlet.io\n}');
});

// Изменение данных.
test('genDiffOConfigs change', () => {
  const data1 = { timeout: 20, host: 'hexlet.io' };
  const data2 = { timeout: 50, host: 'hexlet.io' };
  expect(genDiffOConfigs(data1, data2)).toEqual('{\n  + timeout: 50\n  - timeout: 20\n    host: hexlet.io\n}');
});

// Полный тест с чтением данных из файлов.
test('getDiff', () => {
  const pathToFile1 = getFixturePath('after.json');
  const pathToFile2 = getFixturePath('before.json');
  const expectedDiff = readFile('diff_after_before_json.txt');
  expect(genDiff('json', pathToFile1, pathToFile2)).toEqual(expectedDiff);
});
