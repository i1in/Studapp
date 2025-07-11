import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MAX_FILE_SIZE_IMG, MAX_FILE_SIZE, ALLOWED_FILE_TYPES_IMG } from '../config/uploadConfig.js';
import ApiError from '../error/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDir = path.resolve(__dirname, '..', 'static');

if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, staticDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uuidv4()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 6
    }
});

export const uploadImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES_IMG.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(ApiError.badRequest(`Only ${ALLOWED_FILE_TYPES_IMG.join(', ')}`), false);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE_IMG,
        files: 1
    }
});

export const uploadFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});