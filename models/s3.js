const AWS = require("aws-sdk");
const s3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_KEY,
    signatureVersion: 'v4'
});

const moment = require("moment");
async function generateUploadURL() {
    const params = ({
        Bucket: process.env.BUCKET, 
        Key: moment().format("YYYYMMDDHHmmss"), // S3檔案名稱
        Expires: 60
    })
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

module.exports = generateUploadURL