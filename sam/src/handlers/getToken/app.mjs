import jwt  from 'njwt';

export const handler = async (event) => {
  console.info(event);

  const body = JSON.parse(event.body);
  const user = body.username;
  const claims = { iss: 'getting-started-with-serverless', sub: user, scope: 'admins' };
  const token = jwt.create(claims, 'secretphrase');
  token.setExpiration(new Date('2099-01-01'));

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Headers': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    },
    body: token.compact()
  };

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
