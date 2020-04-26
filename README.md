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

## Пример использования
```sh
$ gendiff -f json 'after.json' 'before.json'
```
[![asciicast](https://asciinema.org/a/0ZP2YkEQJDw5xU1K18LxFWJFF.png)](https://asciinema.org/a/0ZP2YkEQJDw5xU1K18LxFWJFF)

```sh
$ gendiff -f yaml 'after.yml' 'before.yml'
```
[![asciicast](https://asciinema.org/a/4Pge1qLgzbXcOaF1jhkkEaQAA.png)](https://asciinema.org/a/4Pge1qLgzbXcOaF1jhkkEaQAA)

```sh
$ gendiff -f ini 'after.ini' 'before.ini'
```
[![asciicast](https://asciinema.org/a/72ihIOoEjE2CLkDiXC49AJqvX.png)](https://asciinema.org/a/72ihIOoEjE2CLkDiXC49AJqvX)