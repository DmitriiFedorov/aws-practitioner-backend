import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const EXPIRES_IN = 3600;

export const importProductsFile = async (event) => {
  const bucket = process.env.BUCKET;
  const region = process.env.REGION;
  const fileName = event.queryStringParameters?.name;

  const client = new S3Client({ region });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `uploaded/${fileName}`,
  });
  const url = await getSignedUrl(client, command, { expiresIn: EXPIRES_IN });

  return {
    statusCode: 202,
    body: url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
