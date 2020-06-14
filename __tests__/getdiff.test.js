import path from 'path';
import fs from 'fs';
import { getParsedJSON, getParsedYAML, getParsedINI } from '../src/parsers.js';
import getDiffTree from '../src/trees.js';
import getFormatter from '../src/formatters/index.js';
import { genDiff } from '../src/diffconfigs.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Вспомогательные функции
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование парсинга исходных файлов
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const parsedData = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
  },
};

test('getParsedJSON', () => {
  const data = readFile('before_tree.json');
  expect(getParsedJSON(data)).toEqual(parsedData);
});

test('getParsedYAML', () => {
  const data = readFile('before_tree.yml');
  expect(getParsedYAML(data)).toEqual(parsedData);
});

test('getParsedINI', () => {
  const data = readFile('before_tree.ini');
  expect(getParsedINI(data)).toEqual(parsedData);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование построения "внутреннего" дерева различий
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const tree = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting6: {
      key: 'value',
    },
  },
};

const diffEqual = [
  {
    name: 'common',
    type: 'unchanged',
    value: [
      {
        name: 'setting1',
        type: 'unchanged',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'unchanged',
        value: 200,
      },
      {
        name: 'setting6',
        type: 'unchanged',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
    ],
  },
];

const treeBeforeAddAndRemove = {
  common: {
    setting2: 200,
    setting4: {
      key: 'value',
    },
  },
};

const treeAfterAddAndRemove = {
  common: {
    setting1: 'Value 1',
    setting5: {
      key: 'value',
      ops: 'vops',
    },
  },
};

const diffAddedAndRemoved = [
  {
    name: 'common',
    type: 'changed',
    value: [
      {
        name: 'setting2',
        type: 'removed',
        value: 200,
      },
      {
        name: 'setting4',
        type: 'removed',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
      {
        name: 'setting1',
        type: 'added',
        value: 'Value 1',
      },
      {
        name: 'setting5',
        type: 'added',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
          {
            name: 'ops',
            type: 'unchanged',
            value: 'vops',
          },
        ],
      },
    ],
  },
];

const treeBeforeChange = {
  common: {
    setting2: 200,
    setting3: true,
    setting5: {
      key: 'value',
      ops: 'vops',
    },
  },
};

const treeAfterChange = {
  common: {
    setting2: 100,
    setting3: false,
    setting5: {
      key: 'value',
      ops: 'opsv',
    },
  },
};

const diffChanged = [
  {
    name: 'common',
    type: 'changed',
    value: [
      {
        name: 'setting2',
        type: 'changed',
        beforeValue: 200,
        afterValue: 100,
      },
      {
        name: 'setting3',
        type: 'changed',
        beforeValue: true,
        afterValue: false,
      },
      {
        name: 'setting5',
        type: 'changed',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
          {
            name: 'ops',
            type: 'changed',
            beforeValue: 'vops',
            afterValue: 'opsv',
          },
        ],
      },
    ],
  },
];

test.each([
  ['equal', tree, tree, diffEqual],
  ['added & removed', treeBeforeAddAndRemove, treeAfterAddAndRemove, diffAddedAndRemoved],
  ['changed', treeBeforeChange, treeAfterChange, diffChanged],
])('getDiffTree %s', (title, beforeTree, afterTree, diffTree) => {
  expect(diffTree).toEqual(getDiffTree(beforeTree, afterTree));
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование форматеров
// ++++++++++++++++++++++++++++++++++++++++++++++++++

const diffTreeUnchanged = [
  {
    name: 'common',
    type: 'unchanged',
    value: [
      {
        name: 'setting1',
        type: 'unchanged',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'unchanged',
        value: '200',
      },
      {
        name: 'setting3',
        type: 'unchanged',
        value: 'true',
      },
      {
        name: 'setting6',
        type: 'unchanged',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
    ],
  },
];

const diffTreeRemovedAndAdded = [
  {
    name: 'common',
    type: 'changed',
    value: [
      {
        name: 'setting1',
        type: 'unchanged',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'removed',
        value: '200',
      },
      {
        name: 'setting3',
        type: 'added',
        value: 'true',
      },
      {
        name: 'setting6',
        type: 'added',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
    ],
  },
];

const diffTreeChanged = [
  {
    name: 'common',
    type: 'changed',
    value: [
      {
        name: 'setting1',
        type: 'unchanged',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'changed',
        beforeValue: 200,
        afterValue: 100,
      },
      {
        name: 'setting5',
        type: 'changed',
        beforeValue: [
          {
            name: 'key5',
            type: 'unchanged',
            value: 'value5',
          },
        ],
        afterValue: 12345,
      },
      {
        name: 'setting6',
        type: 'changed',
        beforeValue: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
        afterValue: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value 6',
          },
        ],
      },
    ],
  },
];

const stylishFormatter = getFormatter('stylish');

test.each([
  ['unchanged', 'stylish_unchanged.txt', diffTreeUnchanged, stylishFormatter],
  ['removed & added', 'stylish_removed_added.txt', diffTreeRemovedAndAdded, stylishFormatter],
  ['changed', 'stylish_changed.txt', diffTreeChanged, stylishFormatter],
])('genDiff stylish %s', (title, fileName, diffTree, formatter) => {
  const diffString = readFile(fileName);
  expect(diffString).toEqual(genDiff(diffTree, formatter));
});

const plainFormatter = getFormatter('plain');

test.each([
  ['unchanged', 'plain_unchanged.txt', diffTreeUnchanged, plainFormatter],
  ['removed & added', 'plain_removed_added.txt', diffTreeRemovedAndAdded, plainFormatter],
  ['changed', 'plain_changed.txt', diffTreeChanged, plainFormatter],
])('genDiff plain %s', (title, fileName, diffTree, formatter) => {
  const diffString = readFile(fileName);
  expect(diffString).toEqual(genDiff(diffTree, formatter));
});

const jsonFormatter = getFormatter('json');

test.each([
  ['unchanged', 'json_unchanged.txt', diffTreeUnchanged, jsonFormatter],
  ['removed & added', 'json_removed_added.txt', diffTreeRemovedAndAdded, jsonFormatter],
  ['changed', 'json_changed.txt', diffTreeChanged, jsonFormatter],
])('genDiff json %s', (title, fileName, diffTree, formatter) => {
  const diffString = readFile(fileName);
  expect(diffString).toEqual(genDiff(diffTree, formatter));
});
