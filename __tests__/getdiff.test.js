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

test('getDiffTree equal', () => {
  const before = {
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting6: {
        key: 'value',
      },
    },
  };

  const after = {
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting6: {
        key: 'value',
      },
    },
  };

  const diff = [
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
          name: 'setting3',
          type: 'unchanged',
          value: true,
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

  const diffTree = getDiffTree(before, after);
  expect(diffTree).toEqual(diff);
});

test('getDiffTree add', () => {
  const before = {
    common: {
      setting1: 'Value 1',
      setting4: {
        key: 'value',
      },
    },
  };

  const after = {
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting4: {
        key: 'value',
      },
      setting5: {
        key: 'value',
        ops: 'vops',
      },
    },
  };

  const diff = [
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
          name: 'setting4',
          type: 'unchanged',
          value: [
            {
              name: 'key',
              type: 'unchanged',
              value: 'value',
            },
          ],
        },
        {
          name: 'setting2',
          type: 'added',
          value: 200,
        },
        {
          name: 'setting3',
          type: 'added',
          value: true,
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

  const diffTree = getDiffTree(before, after);
  expect(diffTree).toEqual(diff);
});

test('getDiffTree delete', () => {
  const before = {
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting4: {
        key: 'value',
      },
      setting5: {
        key: 'value',
        ops: 'vops',
      },
    },
  };

  const after = {
    common: {
      setting1: 'Value 1',
      setting4: {
        key: 'value',
      },
    },
  };

  const diff = [
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
          name: 'setting4',
          type: 'unchanged',
          value: [
            {
              name: 'key',
              type: 'unchanged',
              value: 'value',
            },
          ],
        },
        {
          name: 'setting2',
          type: 'removed',
          value: 200,
        },
        {
          name: 'setting3',
          type: 'removed',
          value: true,
        },
        {
          name: 'setting5',
          type: 'removed',
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

  const diffTree = getDiffTree(before, after);
  expect(diffTree).toEqual(diff);
});

test('getDiffTree change', () => {
  const before = {
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting4: {
        key: 'value',
      },
      setting5: {
        key: 'value',
        ops: 'vops',
      },
    },
  };

  const after = {
    common: {
      setting1: 'Value 1',
      setting2: 100,
      setting3: false,
      setting4: {
        key: 'value 4',
      },
      setting5: {
        key: 'value',
        ops: 'opsv',
      },
    },
  };

  const diff = [
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
          name: 'setting3',
          type: 'changed',
          beforeValue: true,
          afterValue: false,
        },
        {
          name: 'setting4',
          type: 'changed',
          value: [
            {
              name: 'key',
              type: 'changed',
              beforeValue: 'value',
              afterValue: 'value 4',
            },
          ],
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

  const diffTree = getDiffTree(before, after);
  expect(diffTree).toEqual(diff);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование построения "внутреннего" дерева различий
// с использованием test.each
// ++++++++++++++++++++++++++++++++++++++++++++++++++

// Данные не изменились.
const before1 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
    },
  },
};

const after1 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
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
        name: 'setting3',
        type: 'unchanged',
        value: true,
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

// Данные были добавлены.
const before2 = {
  common: {
    setting1: 'Value 1',
    setting4: {
      key: 'value',
    },
  },
};

const after2 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting4: {
      key: 'value',
    },
    setting5: {
      key: 'value',
      ops: 'vops',
    },
  },
};

const diffAdded = [
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
        name: 'setting4',
        type: 'unchanged',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
      {
        name: 'setting2',
        type: 'added',
        value: 200,
      },
      {
        name: 'setting3',
        type: 'added',
        value: true,
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

// Данные были удалены.
const before3 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting4: {
      key: 'value',
    },
    setting5: {
      key: 'value',
      ops: 'vops',
    },
  },
};

const after3 = {
  common: {
    setting1: 'Value 1',
    setting4: {
      key: 'value',
    },
  },
};

const diffRemoved = [
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
        name: 'setting4',
        type: 'unchanged',
        value: [
          {
            name: 'key',
            type: 'unchanged',
            value: 'value',
          },
        ],
      },
      {
        name: 'setting2',
        type: 'removed',
        value: 200,
      },
      {
        name: 'setting3',
        type: 'removed',
        value: true,
      },
      {
        name: 'setting5',
        type: 'removed',
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

// Данные были изменены.
const before4 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting4: {
      key: 'value',
    },
    setting5: {
      key: 'value',
      ops: 'vops',
    },
  },
};

const after4 = {
  common: {
    setting1: 'Value 1',
    setting2: 100,
    setting3: false,
    setting4: {
      key: 'value 4',
    },
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
        name: 'setting3',
        type: 'changed',
        beforeValue: true,
        afterValue: false,
      },
      {
        name: 'setting4',
        type: 'changed',
        value: [
          {
            name: 'key',
            type: 'changed',
            beforeValue: 'value',
            afterValue: 'value 4',
          },
        ],
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
  [before1, after1, diffEqual],
  [before2, after2, diffAdded],
  [before3, after3, diffRemoved],
  [before4, after4, diffChanged],
])('Build diffTree %#', (before, after, diffTree) => {
  expect(getDiffTree(before, after)).toEqual(diffTree);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование форматера 'stylish'
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

const diffTreeRemAndAdd = [
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
        type: 'added',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'removed',
        value: '200',
      },
      {
        name: 'setting3',
        type: 'changed',
        beforeValue: 'true',
        afterValue: 'false',
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

test('genDiff stylish unchanged', () => {
  const diffString = `{
    common: {
        setting1: Value 1
        setting2: 200
        setting3: true
        setting6: {
            key: value
        }
    }
}`;
  const formatter = getFormatter('stylish');

  expect(diffString).toEqual(genDiff(diffTreeUnchanged, formatter));
});

test('genDiff stylish removed & added', () => {
  const diffString = `{
    common: {
        setting1: Value 1
      - setting2: 200
      + setting3: true
      + setting6: {
            key: value
        }
    }
}`;
  const formatter = getFormatter('stylish');

  expect(diffString).toEqual(genDiff(diffTreeRemAndAdd, formatter));
});

test('genDiff stylish changed', () => {
  const diffString = `{
    common: {
      + setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: false
      - setting5: {
            key5: value5
        }
      + setting5: 12345
      - setting6: {
            key: value
        }
      + setting6: {
            key: value 6
        }
    }
}`;
  const formatter = getFormatter('stylish');

  expect(diffString).toEqual(genDiff(diffTreeChanged, formatter));
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование форматера 'plain'
// ++++++++++++++++++++++++++++++++++++++++++++++++++

test('genDiff plain unchanged', () => {
  const diffString = '';
  const formatter = getFormatter('plain');

  expect(diffString).toEqual(genDiff(diffTreeUnchanged, formatter));
});

test('genDiff plain removed & added', () => {
  const diffString = `Property 'common.setting2' was deleted
Property 'common.setting3' was added with value: true
Property 'common.setting6' was added with value: [complex value]
`;
  const formatter = getFormatter('plain');

  expect(diffString).toEqual(genDiff(diffTreeRemAndAdd, formatter));
});

test('genDiff plain changed', () => {
  const diffString = `Property 'common.setting1' was added with value: Value 1
Property 'common.setting2' was deleted
Property 'common.setting3' was changed from true to false
Property 'common.setting5' was changed from [complex value] to 12345
Property 'common.setting6' was changed from [complex value] to [complex value]
`;
  const formatter = getFormatter('plain');

  expect(diffString).toEqual(genDiff(diffTreeChanged, formatter));
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++
// Тестирование форматера 'json'
// ++++++++++++++++++++++++++++++++++++++++++++++++++

test('genDiff json unchanged', () => {
  const diffString = `[
  {
    "name": "common",
    "type": "unchanged",
    "value": [
      {
        "name": "setting1",
        "type": "unchanged",
        "value": "Value 1"
      },
      {
        "name": "setting2",
        "type": "unchanged",
        "value": "200"
      },
      {
        "name": "setting3",
        "type": "unchanged",
        "value": "true"
      },
      {
        "name": "setting6",
        "type": "unchanged",
        "value": [
          {
            "name": "key",
            "type": "unchanged",
            "value": "value"
          }
        ]
      }
    ]
  }
]`;
  const formatter = getFormatter('json');

  expect(diffString).toEqual(genDiff(diffTreeUnchanged, formatter));
});

test('genDiff json removed & added', () => {
  const diffString = `[
  {
    "name": "common",
    "type": "changed",
    "value": [
      {
        "name": "setting1",
        "type": "unchanged",
        "value": "Value 1"
      },
      {
        "name": "setting2",
        "type": "removed",
        "value": "200"
      },
      {
        "name": "setting3",
        "type": "added",
        "value": "true"
      },
      {
        "name": "setting6",
        "type": "added",
        "value": [
          {
            "name": "key",
            "type": "unchanged",
            "value": "value"
          }
        ]
      }
    ]
  }
]`;
  const formatter = getFormatter('json');

  expect(diffString).toEqual(genDiff(diffTreeRemAndAdd, formatter));
});

test('genDiff json changed', () => {
  const diffString = `[
  {
    "name": "common",
    "type": "changed",
    "value": [
      {
        "name": "setting1",
        "type": "added",
        "value": "Value 1"
      },
      {
        "name": "setting2",
        "type": "removed",
        "value": "200"
      },
      {
        "name": "setting3",
        "type": "changed",
        "beforeValue": "true",
        "afterValue": "false"
      },
      {
        "name": "setting5",
        "type": "changed",
        "beforeValue": [
          {
            "name": "key5",
            "type": "unchanged",
            "value": "value5"
          }
        ],
        "afterValue": 12345
      },
      {
        "name": "setting6",
        "type": "changed",
        "beforeValue": [
          {
            "name": "key",
            "type": "unchanged",
            "value": "value"
          }
        ],
        "afterValue": [
          {
            "name": "key",
            "type": "unchanged",
            "value": "value 6"
          }
        ]
      }
    ]
  }
]`;
  const formatter = getFormatter('json');

  expect(diffString).toEqual(genDiff(diffTreeChanged, formatter));
});
