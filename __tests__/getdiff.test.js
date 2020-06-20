import path from 'path';
import fs from 'fs';
import getFormatter from '../src/formatters/index.js';
import { getDiffTreeConfigs, genDiff } from '../src/diffconfigs.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const stylish = readFile('stylish_diff.txt');
const plain = readFile('plain_diff.txt');
const json = readFile('json_diff.txt');
const formatDiffs = { stylish, plain, json };

const jsonDataBefore = readFile('config_before.json');
const jsonDataAfter = readFile('config_after.json');
const jsonDiffTree = getDiffTreeConfigs('.json', jsonDataBefore, jsonDataAfter);

test.each(['stylish', 'plain', 'json'])('genDiff JSON %s',
  (formatter) => {
    expect(formatDiffs[formatter]).toEqual(genDiff(jsonDiffTree, getFormatter(formatter)));
  });

const yamlDataBefore = readFile('config_before.yml');
const yamlDataAfter = readFile('config_after.yml');
const yamlDiffTree = getDiffTreeConfigs('.yml', yamlDataBefore, yamlDataAfter);

test.each(['stylish', 'plain', 'json'])('genDiff YAML %s',
  (formatter) => {
    expect(formatDiffs[formatter]).toEqual(genDiff(yamlDiffTree, getFormatter(formatter)));
  });

const iniDataBefore = readFile('config_before.ini');
const iniDataAfter = readFile('config_after.ini');
const iniDiffTree = getDiffTreeConfigs('.ini', iniDataBefore, iniDataAfter);

test.each(['stylish', 'plain', 'json'])('genDiff INI %s',
  (formatter) => {
    expect(formatDiffs[formatter]).toEqual(genDiff(iniDiffTree, getFormatter(formatter)));
  });
