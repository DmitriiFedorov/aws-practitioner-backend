import AWS from "aws-sdk";
import { randomUUID } from "crypto";

import { validateCreateProductBody } from "../../validators";

const dynamo = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const createProduct = async (event) => {
  const { body } = event;

  const { error, value } = validateCreateProductBody(JSON.parse(body));

  if (error) {
    return {
      statusCode: 400,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({ error: "Bad request" }),
    };
  }

  const newItem = { ...value, id: randomUUID() };

  try {
    await dynamo
      .put({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Item: newItem,
      })
      .promise();

    const productQuery = await dynamo
      .query({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": newItem.id },
      })
      .promise();

    return {
      statusCode: 201,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify(productQuery),
    };
  } catch (error) {
    return {
      statusCode: error?.code || error?.statusCode || 500,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({ error: error?.message ?? "Something went wrong" }),
    };
  }
};