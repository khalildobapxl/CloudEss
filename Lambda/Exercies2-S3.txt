import { S3 } from '@aws-sdk/client-s3';

console.log('Loading function');
const s3 = new S3();


export const handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        // Get object metadata (includes size)
        const data = await s3.headObject(params);
        const contentType = data.ContentType;
        const contentLength = data.ContentLength; // Size in bytes

        // Log the file name and size
        console.log(`File uploaded: ${key} ${contentLength} bytes`);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully retrieved file details',
                fileName: key,
                fileSize: contentLength,
                contentType: contentType,
            }),
        };
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};
