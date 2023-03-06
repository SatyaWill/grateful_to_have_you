const AWS = require("aws-sdk");
const s3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_KEY,
    signatureVersion: 'v4'
});

const moment = require("moment");
module.exports = async function generateUploadURL(folderName) {
    const params = ({
        Bucket: process.env.BUCKET, 
        Key: folderName +"/"+ moment().utcOffset(480).format("YYYYMMDDHHmmss"), // S3檔案名稱
        Expires: 60
    })
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}
