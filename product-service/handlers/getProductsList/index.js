import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async () => {
  try {
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

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(productsWithCount ?? []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
      }),
    };
  }
};
