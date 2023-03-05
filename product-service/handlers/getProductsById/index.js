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
  logger.info(`Product id - ${productId}`);

  if (!productId) {
    logger.info("FINISH FAIL getProductsById");
    return NOT_FOUND_RESPONSE;
  }

  try {
    const productQuery = dynamo.query({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": productId },
    });
    const stockQuery = dynamo.query({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: { ":product_id": productId },
    });

    const [productResult, stockResult] = await Promise.all([
      productQuery.promise(),
      stockQuery.promise(),
    ]);

    const isEmptySearchResult =
      productResult.Count === 0 || stockResult.Count === 0;

    if (isEmptySearchResult) {
      logger.info("FINISH FAIL getProductsById");
      return NOT_FOUND_RESPONSE;
    }

    const product = {
      ...productResult.Items[0],
      count: stockResult.Items[0].count,
    };

    logger.info("FINISH SUCCESS getProductsById");
    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify(product),
    };
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
