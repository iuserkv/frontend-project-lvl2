import path from 'path';
import fs from 'fs';

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

const readFile = (pathToFile) => {
  const absPathToFile = path.resolve(pathToFile);
  if (fileExist(absPathToFile)) {
    return fs.readFileSync(pathToFile, 'utf-8');
  }

  return null;
};

export default readFile;
