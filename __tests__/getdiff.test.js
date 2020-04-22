import path from 'path';
import fs from 'fs';
import genDiff from '../src/getdiff.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let pathToFile1;
let pathToFile2;
let expectedDiff;

beforeAll(() => {
  pathToFile1 = getFixturePath('after.json');
  pathToFile2 = getFixturePath('before.json');
  expectedDiff = readFile('diff_after_before_json.txt');
});

test('getDiff', () => {
  const realDiff = genDiff(pathToFile1, pathToFile2);
  expect(realDiff).toEqual(expectedDiff);
});
