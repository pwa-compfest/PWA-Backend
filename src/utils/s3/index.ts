import aws from "aws-sdk";
import fs from "fs";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Uploads a file to an S3 bucket
export const uploadFile = (file:any,bucket:string) => {
    const s3Params = {
        Bucket: bucket,
        Key: `${file.filename}`,
        signatureVersion: "v4",
        Body: fs.createReadStream(file.path),
        region : process.env.AWS_REGION
    };
        s3.upload(s3Params, (err:any, data:any) => {
            if (err) {
                console.log("Error", err);
            }
            if (data) {
                fs.unlinkSync(file.path);
            }
        });

}

export const getSignedUrl = (file:any,bucket:string) => {
    const s3Params = {
        Bucket: bucket,
        Key: `${file.filename}`,
        Expires: 60,
    };
    const url = s3.getSignedUrl('putObject', s3Params);
    return url;
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
export const downloadObject = (key: string,bucket: string) => {
    const s3Params = {
        Bucket: bucket,
        Key: key
    };
    return s3.getObject(s3Params).createReadStream();

}
