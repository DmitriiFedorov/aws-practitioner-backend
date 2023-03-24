import { Buffer } from "buffer";

const generateResponse = ({ effect, resource }) => {
  return {
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const decodeBase64 = (data) => {
  const buffer = Buffer.from(data, "base64");

  return buffer.toString();
};

const extractToken = (authHeader) => {
  const [, token] = authHeader.split("Basic ");

  return token;
};

const basicAuthorizer = async (event) => {
  const { authorizationToken, methodArn } = event;
  const receivedToken = extractToken(authorizationToken);

  if (!receivedToken) throw new Error("No token is provided");

  const [providedUsername, providedPassword] =
    decodeBase64(receivedToken).split(":");

  const storedPassword = process.env[providedUsername];

  const areCredentialsCorrect =
    Boolean(storedPassword) &&
    Boolean(providedPassword) &&
    storedPassword === providedPassword;

  return areCredentialsCorrect
    ? generateResponse({
        effect: "Allow",
        resource: methodArn,
      })
    : generateResponse({
        effect: "Deny",
        resource: methodArn,
      });
};

export { basicAuthorizer };
