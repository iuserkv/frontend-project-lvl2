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

export default fileExist;
