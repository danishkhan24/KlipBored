const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFile = async (fileBuffer, fileName, mimeType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
    });

    try {
        const response = await s3Client.send(command);
        return { Location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` };
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Error uploading file');
    }
};

const getFileUrl = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw new Error('Error getting file URL');
    }
};

module.exports = { uploadFile, getFileUrl };
