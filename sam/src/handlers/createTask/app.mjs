// Paste code from workshop below this line
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const tableName = process.env.TASKS_TABLE;

export const handler = async (event) => {
  console.info('received:', event);

  const body = JSON.parse(event.body);
  const user = event.requestContext.authorizer.principalId;
  const id = uuidv4();
  const title = body.title;
  const bodyText = body.body;
  const createdAt = new Date().toISOString();

  let dueDate = createdAt;

  if ('dueDate' in body) {
    dueDate = body.dueDate
  }

  const params = {
    TableName: tableName,
    Item: { user: `user#${user}`, id: `task#${id}`, title: title, body: bodyText, dueDate: dueDate, createdAt: createdAt }
  };

  console.info(`Writing data to table ${tableName}`);
  const data = await ddbDocClient.send(new PutCommand(params));
  console.log('Success - item added or updated', data);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  };
  return response;
};

