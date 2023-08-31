import fs from 'fs';

export const createDirectory = (path: string, pathToFile = true) => {
    let dirPath = path.split('\\').join('/');

    if (pathToFile) {
        const s = dirPath.split('/');
        s.pop();
        dirPath = s.join('/');
    }

    fs.mkdir(dirPath, { recursive: true }, () => {});
};
