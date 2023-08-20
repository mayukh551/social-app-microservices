import { uploadImage } from '../../util/cloudStorageHelpers';
import PostError from '../Errors/PostError';
import asyncWrapper from '../Middlewares/async-wrapper';

export const singleImageHanlder = asyncWrapper(async (req, res, next) => {
    try {
        // Get the uploaded file from the request object
        const myFile = req.file;

        // If no file was uploaded
        if (!myFile) throw new PostError(400, 'No Image/file was uploaded', null);

        /**
         * Upload the file to a Google Cloud Storage Bucket 
         * and get the URL of the uploaded image
         * */
        const imageUrl = await uploadImage(myFile);

        // Send a response with a success message and the URL of the uploaded image
        res
            .status(200)
            .json({
                message: "Upload was successful",
                data: imageUrl
            })
    } catch (err) {
        // If there was an error during the upload, throw an error with a 500 status code
        throw new PostError(500, 'Server Error', err);
    }
});

export const multipleImageHandler = asyncWrapper(async (req, res, next) => {
    try {
        const myFiles = req.files;


        // check if files are defined
        if (!myFiles || !Array.isArray(myFiles)) throw new PostError(400, 'No Images/files were uploaded', null);

        const totalImages = myFiles.length;

        // count no. of images uploaded
        let imagesUploaded = 0;

        // store an array of image urls
        const imageUrls: string[] = [];

        for (const file of myFiles) {
            try {
                /**
                 * no. of images successfully
                 * uploaded to Google Cloud Storage
                 */
                const imageUrl = await uploadImage(file) as string;
                imageUrls.push(imageUrl);
                imagesUploaded++;

            } catch (err) {
                console.log(err);
            }
        }

        res
            .status(200)
            .json({
                message: `${imagesUploaded} images successfully uploaded. ${totalImages - imagesUploaded} Images failed to upload!`,
                data: imageUrls
            });

    } catch (err) {
        throw new PostError(500, 'Server Error', err);
    }
});