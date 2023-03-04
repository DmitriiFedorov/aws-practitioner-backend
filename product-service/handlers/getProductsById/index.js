import AWS from "aws-sdk";

import { logger } from "../../services/Logger";

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

  logger.info("START getProductsById");
  logger.info(JSON.stringify({ productId }));

  if (!productId) {
    logger.info("FINISH FAIL getProductsById");
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
      logger.info("FINISH SUCCESS getProductsById");
      return {
        statusCode: 200,
        headers: {
          ...CORS_HEADERS,
        },
        body: JSON.stringify(product),
      };
    }

    logger.info("FINISH FAIL getProductsById");
    return NOT_FOUND_RESPONSE;
  } catch (error) {
    logger.error(error);

    return {
      statusCode: error?.code || error?.statusCode || 500,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({ error: error?.message ?? "Something went wrong" }),
    };
  }
};
