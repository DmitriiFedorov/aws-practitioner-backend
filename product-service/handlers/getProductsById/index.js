import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const NOT_FOUND_RESPONSE = {
  statusCode: 404,
  headers: {
    ...CORS_HEADERS,
  },
  body: JSON.stringify({ error: "Not found" }),
};

export const getProductsById = async (event) => {
  const pathParameters = event.pathParameters;
  const productId = pathParameters?.productId ?? "";

  if (!productId) {
    return NOT_FOUND_RESPONSE;
  }

  try {
    const productQuery = await dynamo
      .query({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": productId },
      })
      .promise();

    const product = productQuery.Items[0];

    if (product) {
      return {
        statusCode: 200,
        headers: {
          ...CORS_HEADERS,
        },
        body: JSON.stringify(product),
      };
    }

    return NOT_FOUND_RESPONSE;
  } catch (error) {
    console.log(error);

    return {
      statusCode: error?.code || error?.statusCode || 500,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({ error: error?.message ?? "Something went wrong" }),
    };
  }
};
