import path from 'path';
import fs from 'fs';
import { genDiff } from '../src/differ.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  ['JSON', 'stylish', 'config_before.json', 'config_after.json', 'stylish_diff.txt'],
  ['JSON', 'plain', 'config_before.json', 'config_after.json', 'plain_diff.txt'],
  ['JSON', 'json', 'config_before.json', 'config_after.json', 'json_diff.txt'],
  ['YAML', 'stylish', 'config_before.yml', 'config_after.yml', 'stylish_diff.txt'],
  ['YAML', 'plain', 'config_before.yml', 'config_after.yml', 'plain_diff.txt'],
  ['YAML', 'json', 'config_before.yml', 'config_after.yml', 'json_diff.txt'],
  ['INI', 'stylish', 'config_before.ini', 'config_after.ini', 'stylish_diff.txt'],
  ['INI', 'plain', 'config_before.ini', 'config_after.ini', 'plain_diff.txt'],
  ['INI', 'json', 'config_before.ini', 'config_after.ini', 'json_diff.txt'],
])('genDiff %s %s',
  (type, format, pathToFileBefore, pathToFileAfter, pathToFileFormattedDiff) => {
    const formattedDiff = readFile(pathToFileFormattedDiff);
    expect(formattedDiff).toEqual(genDiff(
      getFixturePath(pathToFileBefore),
      getFixturePath(pathToFileAfter),
      format,
    ));
  });
