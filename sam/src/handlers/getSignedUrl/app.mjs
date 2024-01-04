import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const bucket = process.env.S3_BUCKET;

export const handler = async (event) => {
  console.info(event);
  const client = new S3Client();
  const user = event.requestContext.authorizer.principalId;

  if (!event.queryStringParameters.filename) {
    throw new Error('Parameter missing: filename');
  }

  if (!event.queryStringParameters.filetype) {
    throw new Error('Parameter missing: filetype');
  }

  if (!event.queryStringParameters.taskId) {
    throw new Error('Parameter missing: taskId');
  }

  const filename = uuidv4() + path.extname(event.queryStringParameters.filename);
  const filetype = event.queryStringParameters.filetype;
  const taskId = event.queryStringParameters.taskId;
  const objectName = `${user}/${taskId}/${filename}`;

  const putObjectParams = {
    Bucket: bucket,
    Key: objectName,
    ContentType: filetype
  };

  const command = new PutObjectCommand(putObjectParams);
  console.log('Params: ', putObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log('Url: ', url);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadURL: url,
      objectName
    })
  };

  console.log('response: ' + JSON.stringify(response));
  return response;
};
