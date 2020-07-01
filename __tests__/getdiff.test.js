import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  ['JSON', 'stylish', 'config_before.json', 'config_after.json', 'stylish_diff.txt'],
  ['YAML', 'plain', 'config_before.yml', 'config_after.yml', 'plain_diff.txt'],
  ['INI', 'json', 'config_before.ini', 'config_after.ini', 'json_diff.txt'],
])('genDiff %s %s',
  (type, format, pathToFileBefore, pathToFileAfter, pathToFileFormattedDiff) => {
    const expectedDiff = readFile(pathToFileFormattedDiff);
    const fullPathToFileBefore = getFixturePath(pathToFileBefore);
    const fullPathToFileAfter = getFixturePath(pathToFileAfter);
    const receivedDiff = genDiff(fullPathToFileBefore, fullPathToFileAfter, format);
    expect(expectedDiff).toEqual(receivedDiff);
  });
