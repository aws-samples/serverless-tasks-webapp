const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient()
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)
const tableName = process.env.TASKS_TABLE

exports.handler = async (event) => {
  console.info('received:', event)

  const user = event.requestContext.authorizer.principalId
  const id = event.pathParameters.id

  const params = {
    TableName: tableName,
    Key: { user: `user#${user}`, id: `task#${id}` }
  }

  console.log(`Getting task: ${params}`)
  const data = await ddbDocClient.send(new GetCommand(params))

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data.Item)
  }

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`)
  return response
}
