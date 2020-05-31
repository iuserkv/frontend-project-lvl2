# Difference Generator
**Difference Generator** - утлилита для нахождения различий между двумя конфигурационными файлами.

## nodejs-package
[![Node CI](https://github.com/iuserkv/frontend-project-lvl2/workflows/CI/badge.svg)](https://github.com/iuserkv/frontend-project-lvl2/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/42ff81a71c784afc2a6f/maintainability)](https://codeclimate.com/github/iuserkv/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/42ff81a71c784afc2a6f/test_coverage)](https://codeclimate.com/github/iuserkv/frontend-project-lvl2/test_coverage)

## Установка
```sh
$ make install
```

## Примеры использования
```sh
$ gendiff 'before_tree.json' 'after_tree.json'
$ gendiff -f stylish 'before_tree.json' 'after_tree.json'
$ gendiff -f plain 'before_tree.json' 'after_tree.json'
$ gendiff -f json 'before_tree.json' 'after_tree.json'
$ gendiff 'before_tree.yml' 'after_tree.yml'
$ gendiff -f plain 'before_tree.ini' 'after_tree.ini'

```
[![asciicast](https://asciinema.org/a/UKERAVC7X4owCeXFJ4vDTgYcw.png)](https://asciinema.org/a/UKERAVC7X4owCeXFJ4vDTgYcw)