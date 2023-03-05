import AWS from "aws-sdk";
import { randomUUID } from "crypto";

import { logger } from "../../services/Logger";
import { validateCreateProductBody } from "../../validators";

const dynamo = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const createProduct = async (event) => {
  try {
    logger.info("START createProduct");

    const { body } = event;
    const parsedBody = JSON.parse(body);

    logger.info(
      `Request params: title - ${parsedBody.title} | description - ${parsedBody.description} | price - ${parsedBody.price} | count - ${parsedBody.count}`
    );

    const { error, value } = validateCreateProductBody(parsedBody);

    if (error) {
      return {
        statusCode: 400,
        headers: {
          ...CORS_HEADERS,
        },
        body: JSON.stringify({ error: "Bad request" }),
      };
    }

    const { description, title, price, count } = value;
    const id = randomUUID();

    const newProductTableItem = { title, description, price, id };
    const newStockTableItem = { product_id: id, count };

    const productPut = dynamo.put({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: newProductTableItem,
    });

    const stockPut = dynamo.put({
      TableName: process.env.STOCKS_TABLE_NAME,
      Item: newStockTableItem,
    });

    await Promise.all([productPut.promise(), stockPut.promise()]);

    const productQuery = dynamo.query({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id },
    });

    const stockQuery = dynamo.query({
      TableName: process.env.STOCKS_TABLE_NAME,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: { ":product_id": id },
    });

    const [productResult, stockResult] = await Promise.all([
      productQuery.promise(),
      stockQuery.promise(),
    ]);

    const product = {
      ...productResult.Items[0],
      count: stockResult.Items[0].count,
    };

    logger.info("FINISH SUCCESS createProduct");
    return {
      statusCode: 201,
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
