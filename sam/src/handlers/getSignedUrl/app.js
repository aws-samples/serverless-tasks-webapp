const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const path = require('path')
const uuid = require('uuid')
const bucket = process.env.S3_BUCKET

exports.handler = async (event) => {
  console.info(event)
  const client = new S3Client()
  const user = event.requestContext.authorizer.principalId

  if (!event.queryStringParameters.filename) {
    throw new Error('Parameter missing: filename')
  }

  if (!event.queryStringParameters.filetype) {
    throw new Error('Parameter missing: filetype')
  }

  if (!event.queryStringParameters.taskId) {
    throw new Error('Parameter missing: taskId')
  }

  const filename = uuid.v4() + path.extname(event.queryStringParameters.filename)
  const filetype = event.queryStringParameters.filetype
  const taskId = event.queryStringParameters.taskId
  const objectName = `${user}/${taskId}/${filename}`

  const putObjectParams = {
    Bucket: bucket,
    Key: objectName,
    ContentType: filetype
  }

  const command = new PutObjectCommand(putObjectParams)
  console.log('Params: ', putObjectParams)
  const url = await getSignedUrl(client, command, { expiresIn: 3600 })
  console.log('Url: ', url)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadURL: url,
      objectName
    })
  }

  console.log('response: ' + JSON.stringify(response))
  return response
}
