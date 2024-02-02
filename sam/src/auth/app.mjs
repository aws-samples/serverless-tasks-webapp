// Paste code from workshop below this line
import jwt from 'njwt';

export const handler = function (event, context, callback) {
  console.info('received:', event);
  const token = event.authorizationToken.split(' ')[1];
  jwt.verify(token, 'secretphrase', (err, verifiedJwt) => {
    if (err) {
      console.log(err.message);
      callback('Error: Invalid token');
    } else {
      console.log(`Verified token: ${verifiedJwt}`);
      const resource = `${event.methodArn.split('/', 2).join('/')}/*`;
      const policy = generatePolicy(verifiedJwt.body.sub, 'Allow', resource);
      console.log(`Generated policy: ${JSON.stringify(policy)}`);
      callback(null, policy);
    }
  });
};

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    userId: 1,
    createdAt: new Date().toISOString()
  }
  return authResponse;
}

