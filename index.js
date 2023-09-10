import fs from 'fs';
import path from 'path';

// node index.js

const directoryPath = 'E:/Work/video/area_50/2/';

const twoLevelsUp = path.resolve(directoryPath, '..');
const parentParentFolderName = path.basename(twoLevelsUp);

const parentFolderName = path.basename(directoryPath);

const getNumberFromPath = (str) => {
  return parseInt(path.basename(str).replace(/\D+/, ''));
}

const createContent = (name) => {
  const parentName = !isNaN(getNumberFromPath(parentFolderName)) 
    ? getNumberFromPath(parentFolderName).toString().length < 2 
      ? getNumberFromPath(parentParentFolderName)
      : getNumberFromPath(parentFolderName)
    : getNumberFromPath(parentParentFolderName);

  const folderName = !isNaN(getNumberFromPath(parentFolderName)) && 
    getNumberFromPath(parentFolderName).toString().length < 2 
      ? getNumberFromPath(parentFolderName) 
      : '1';

  return `{
    "base_name": "area_${parentName}_${folderName}_${name}_color_balls_blur.mp4",
    "t_0" :  [0],
    "t_1" :  [0]
  }`
}

const contentBlur = `{
  "points": [
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0}
  ],
    "points2": [
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0}
  ],
    "points3": [
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0}
  ],
  "points4": [
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0},
    {"x": 0, "y": 0}
  ]
}`;

const createFiles = (name) => {
  const newFileName = name.split('.').shift();

  const fileNames = [`${newFileName}.json`, `${newFileName}_blur.json`];

  const contents = [createContent(newFileName), contentBlur];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const content = contents[i];

    const filePath = path.join(directoryPath, fileName);

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(`Произошла ошибка при создании файла ${fileName}:`, err);
      } else {
        console.log(`Файл ${fileName} успешно создан и содержит следующее содержимое:\n`, content);
      }
    });
  }
}

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении каталога:', err);
    
    return;
  }

  files.forEach((file) => {
    try {
      const inputStr = 'input_';
      const lastStr = '_last';
      const mp4Str = 'mp4';
      
      const renameFile = inputStr && file.replace(/\-/g, '_').replace(inputStr, '');
      
      const getSliceIndex = lastStr && renameFile.indexOf(lastStr);
      const getFormat = renameFile.split('.').pop();

      const isMp4 = getFormat === mp4Str;
      const isLastStr = getSliceIndex !== -1;
      
      const newName = renameFile.slice(0, getSliceIndex) + '.' + getFormat;

      const oldFilePath = path.join(directoryPath, file);
      const newFilePath = path.join(directoryPath, newName);

      if (isMp4 && isLastStr) {
        fs.rename(oldFilePath, newFilePath, (err) => {
          if (err) {
            console.error(`Ошибка при переименовании файла ${file}:`, err);
          } else {
            console.log(`Файл ${file} успешно переименован в ${newName}`);

            createFiles(newName);
          }
        });

        return;
      }

      if (isMp4) {
        createFiles(newName);

        return;
      }

      return console.log(`Файл '${file}' не был переименован !`);
    } catch (error) {
      console.log(error);
    }
  });
});