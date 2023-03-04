import AWS from "aws-sdk";

import { logger } from "../../services/Logger";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async () => {
  try {
    logger.info("START getProductsList");

    const [productsScan, stocksScan] = await Promise.all([
      dynamo.scan({ TableName: process.env.PRODUCTS_TABLE_NAME }).promise(),
      dynamo.scan({ TableName: process.env.STOCKS_TABLE_NAME }).promise(),
    ]);

    const productIdToCountMap = stocksScan.Items.reduce((acc, next) => {
      acc[next.product_id] = next.count;
      return acc;
    }, {});

    const productsWithCount = productsScan.Items.map((product) => ({
      ...product,
      count: productIdToCountMap[product.id] ?? 0,
    }));

    logger.info("FINISH SUCCESS getProductsList");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(productsWithCount ?? []),
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
      }),
    };
  }
};
