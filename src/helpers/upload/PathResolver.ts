import path from 'path';
import async from 'async';

/**
 * Single Image Path Resolver
 * 
 * @param {File} file
 */
export const ImagePathResolver = (file: Express.Multer.File): string => {
    if (file) {
        return path.join(file.destination, file.filename);
    }
    return null;
};

/**
 * Multiple Image Path Resolver
 * 
 * @param {File} file
 */
export const ImagesPathResolver = (files: any): Promise<string[]>  => {
    let images: string[] = [];

    return new Promise((resolve, reject) => {
        async.eachOfSeries(files, (file: Express.Multer.File, key: number, callback: Function) => {
            images.push(path.join(file.destination, file.filename));
            callback();
        }, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(images);
            }
        });
    });
};