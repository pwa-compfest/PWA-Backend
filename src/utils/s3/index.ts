import aws from "aws-sdk";
import fs from "fs";

const bucketName = 'perwibuan-mooc' || process.env.BUCKET_NAME;

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Uploads a file to an S3 bucket
export const uploadFile = (file:any) => {
    const s3Params = {
        Bucket: bucketName,
        Key: `${file.filename}`,
        Body: fs.createReadStream(file.path),
    };
    s3.upload(s3Params, (err:any, data:any) => {
        if (err) {
            console.log("Error", err);
        }
        console.log(data);
    });
}

// Deletes an object
export const deleteObject = (bucket: string, key: string) => {
    const s3Params = {
        Bucket: bucket,
        Key: key
    };
    return s3.deleteObject(s3Params).promise();
}

// Downloads an object
export const downloadObject = (bucket: string, key: string) => {
    const s3Params = {
        Bucket: bucket,
        Key: key
    };
    return s3.getObject(s3Params).promise();
}

