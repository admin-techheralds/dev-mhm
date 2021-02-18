import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core'
import { folder } from 'ionicons/icons';
import { APP_FOLDERS_FILES_CONFIG } from './env'

const { Filesystem } = Plugins;

export const isFileExists = async (folderPath, fileName) => {
    try {
        const r = await Filesystem.stat(
                            {
                                directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                                path: folderPath + fileName
                            }
                    )
        console.log('Result stat is:' + JSON.stringify(r));
        return r.type == "file"
    } catch(err) {
        console.log('Error while checking the file:' + folderPath + fileName, err)
    }
    return false;
}

export const isDirExists = async (folderPath) => {
    try {
        const r = await Filesystem.stat(
                            {
                                directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                                path: folderPath
                            }
                    )
        console.log('Result stat is:' + JSON.stringify(r));
        return r.type == "directory"
    } catch(err) {
        console.log('Error while checking the dir:' + folderPath, err)
    }
    return false;
}

export const mkDir = async (folderPath) => {
    try {
        const r = await Filesystem.mkdir(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath,
                            recursive : true
                        }
                    )
        console.log('Make directory result is:' + JSON.stringify(r));
        return true;
    } catch(err) {
        console.log('Error while creating the dir:' + folderPath, err)
    }
    return false;
}


export const rmDir = async (folderPath) => {
    try {
        const r = await Filesystem.rmdir(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath,
                            recursive : true
                        }
                    )
        console.log('remove directory result is:' + JSON.stringify(r));
        return true;
    } catch(err) {
        console.log('Error while removing the dir:' + folderPath, err)
    }
    return false;
}

export const listFilesFromDir = async (folderPath) => {
    try {
        const r = await Filesystem.readdir(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath
                        }
                    )
        console.log('List of files in the given dir:' + folderPath + ' is:', r);
        return r;
    } catch(err) {
        console.log('Error while reading the dir:' + folderPath, err)
    }
    return undefined;
}

// export const createFile = async (folderPath, fileName, content) => {
//     try {
//         const r = await Filesystem.writeFile(
//                         {
//                             directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
//                             path: folderPath + fileName,
//                             data : content,
//                             recursive : true,
//                             encoding : FilesystemEncoding.UTF8
//                         }
//                     )
//         console.log('Create file results  is:', r);
//         return r;
//     } catch(err) {
//         console.log('Error while creating the file:' + folderPath + fileName, err)
//     }
//     return undefined;
// }

export const writeFile = async (folderPath, fileName, content) => {
    try {
        const r = await Filesystem.writeFile(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath + fileName,
                            data : content,
                            recursive : true,
                            encoding : FilesystemEncoding.UTF8
                        }
                    )
        console.log('Write file results  is:', r);
        return r;
    } catch(err) {
        console.log('Error while writing the data to the file:' + folderPath + fileName, err)
    }
    return undefined;
}

export const readFile = async (folderPath, fileName) => {
    try {
        const r = await Filesystem.readFile(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath + fileName,
                            encoding : FilesystemEncoding.UTF8
                        }
                    )
        console.log('Read file results  is:', r);
        return r;
    } catch(err) {
        console.log('Error while reading the file:' + folderPath + fileName, err)
    }
    return undefined;
}

export const deleteFile = async (folderPath, fileName, content) => {
    try {
        const r = await Filesystem.deleteFile(
                        {
                            directory : APP_FOLDERS_FILES_CONFIG.ROOT_FOLDER, 
                            path: folderPath + fileName
                        }
                    )
        console.log('Delete file results  is:', r);
        return r;
    } catch(err) {
        console.log('Error while deleting the file:' + folderPath + fileName, err)
    }
    return undefined;
}

