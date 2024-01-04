import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const tableName = process.env.TASKS_TABLE;

export const handler = async (event) => {
  console.info('received:', event);

  const user = event.requestContext.authorizer.principalId;
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: {
      '#u': 'user'
    },
    ExpressionAttributeValues: {
      ':u': `user#${user}`
    }
  };

  console.info(`Querying table ${tableName}`);
  const data = await ddbDocClient.send(new QueryCommand(params));
  console.log('Success. Item details: ', data.Items);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data.Items)
  };

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
