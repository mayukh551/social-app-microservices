import { format } from "util"
import storage from '../config/cloudStorage'
import PostError from "../src/Errors/PostError";

const bucket = storage.bucket('test-social-bucket-1');


/**
 * @function uploadImage
 * @param {File} file file object that will be uploaded
 * @description - This function does the following
- It uploads a file to the image bucket on Google Cloud
- It accepts an object as an argument with the
"originalname" and "buffer" as keys
 */
export const uploadImage = (file: any) => new Promise((resolve, reject) => {

    const { originalname, buffer } = file

    const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
        resumable: false
    })
    blobStream.on('finish', () => {
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        )
        resolve(publicUrl);
    })
        .on('error', (err) => {
            reject(err);
        })
        .end(buffer)
})



/**
 * @function multipleImagesUpload
 * @param {File[]} myFiles array of files to be uploaded
 * @description - This function uploads images to Google Cloud Storage
 * @returns an array of image urls taken from Google Cloud Storage
 */
export const multipleImagesUpload = async (myFiles: File[]): Promise<string[]> => {

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

    return imageUrls;
}


//******************************************************************************
//* DELETE IMAGES FROM GOOGLE CLOUD STORAGE

export const deleteImage = (fileName: string) => new Promise((resolve, reject) => {

    const file = bucket.file(fileName);

    file.delete()
        .then(() => {
            resolve(true);
        })
        .catch((err) => {
            reject(err);
        })
});