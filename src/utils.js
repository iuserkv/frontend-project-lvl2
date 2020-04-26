import path from 'path';
import fs from 'fs';

// Проверяет существование файла.
const fileExist = (pathToFile) => {
  try {
    fs.statSync(pathToFile);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }

  return true;
};

// Читает и возвращает данные из фала.
const readFile = (pathToFile) => {
  const absPathToFile = path.resolve(pathToFile);
  if (fileExist(absPathToFile)) {
    return fs.readFileSync(pathToFile, 'utf-8');
  }

  return null;
};

export default readFile;
