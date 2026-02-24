import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

// Use memory storage — file stays in RAM, we pipe it to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 * cloudinary.config() is called HERE (lazily) so that dotenv.config()
 * in index.js has already run and process.env values are available.
 *
 * @param {Buffer} buffer  - Image buffer from multer memoryStorage
 * @param {string} folder  - Cloudinary folder name
 */
export const uploadToCloudinary = (buffer, folder = "asset-maintenance") => {
    // Configure Cloudinary at call-time, not at import-time
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};
