const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition')
const ddbClient = new DynamoDBClient()
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)
const rekognitionClient = new RekognitionClient()
const tableName = process.env.TASKS_TABLE

exports.handler = async (event) => {
  console.info(JSON.stringify(event, null, 2))

  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

  const user = key.split('/')[0]
  const taskId = key.split('/')[1]

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { user: `user#${user}`, id: `task#${taskId}` },
    UpdateExpression: 'SET upload = :u',
    ExpressionAttributeValues: {
      ':u': `s3://${bucket}/${key}`
    },
    ReturnValues: 'UPDATED_NEW'
  })

  console.log(`UpdateCommand: ${JSON.stringify(command, null, 2)}`)

  try {
    console.log(`Saving upload for task ${taskId}: s3://${bucket}/${key}`)
    const data = await ddbDocClient.send(command)
    console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.log('Unable to update item. Error JSON:', JSON.stringify(err, null, 2))
    throw err
  }

  console.log(`Detecting labels for bucket ${bucket} and key ${key}`)

  const imageParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  }

  const labelData = await rekognitionClient.send(
    new DetectLabelsCommand(imageParams)
  )
  console.log('Success, labels detected.', labelData)
  const labels = []
  for (let j = 0; j < labelData.Labels.length; j++) {
    const name = labelData.Labels[j].Name
    labels.push(name)
  }

  console.log(`Label data: ${JSON.stringify(labels)}`)

  const updateLabelsCommand = new UpdateCommand({
    TableName: tableName,
    Key: { user: `user#${user}`, id: `task#${taskId}` },
    UpdateExpression: 'SET labels = :s',
    ExpressionAttributeValues: {
      ':s': labels
    },
    ReturnValues: 'UPDATED_NEW'
  })

  try {
    console.log(`Saving labels for task ${taskId}: ${labels}`)
    const data = await ddbDocClient.send(updateLabelsCommand)
    console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.log('Unable to update item. Error JSON:', JSON.stringify(err, null, 2))
    throw err
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(labels)
  }
  return response
}
