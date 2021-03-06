import moment from 'moment';
import multer from 'multer';

import Messages from '../../errors/Messages';
import logger from '../../helpers/logger/Winston';
import { BadRequestError } from '../../errors/Errors';

/**
 * Storage
 */
let storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "uploads/images");
    },
    filename: (request, file, callback) => {
        callback(null, getFilename(file));
    }
});

/**
 * Retrieve Filename
 * 
 * @param {File} file 
 */
let getFilename = (file: Express.Multer.File) => {
    return `${moment().unix()}-${file.originalname}`;
};

/**
 * Valid Image Mime Types
 */
const MimeTypes = [ "image/png", "image/jpg", "image/jpeg", "image/*" ];

/**
 * Upload Middleware
 */
let upload = multer({
    storage: storage,
    fileFilter: (request, file: Express.Multer.File, callback: Function) => {
        logger.info({
            operation: "Uploading Image",
            filename: file.filename,
            filesize: file.size,
            mimetype: file.mimetype, 
        });
        if (MimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new BadRequestError([
               { field: "images", message: Messages.IMAGE_INVALID_TYPE } 
            ]));
        }
    }
});

export default upload;