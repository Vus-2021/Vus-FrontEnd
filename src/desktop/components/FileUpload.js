import S3 from 'react-aws-s3';

const S3_BUCKET = 'test-vus';
const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    dirName: 'images/origin',
};

const FileUpload = async file => {
    const ReactS3Client = new S3(config);
    let location = '';
    await ReactS3Client.uploadFile(file, file.name).then(data => {
        console.log(data.location);
        if (data.status === 204) {
            location = data.location;
        } else {
            console.log('fail');
        }
    });

    return location;
};

export default FileUpload;
