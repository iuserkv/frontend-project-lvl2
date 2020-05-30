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
$ gendiff 'before.json' 'after.json'
$ gendiff -f stylish 'before.yml' 'after.yml'
$ gendiff -f plain 'before.ini' 'after.ini'
```
[![asciicast](https://asciinema.org/a/6a6PrDLNuhxQBSutxupsCXpjc.png)](https://asciinema.org/a/6a6PrDLNuhxQBSutxupsCXpjc)