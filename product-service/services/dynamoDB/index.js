import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

const getProduct = async (productId) => {
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
    return {
      error: true,
      product: null,
    };
  }

  const product = {
    ...productResult.Items[0],
    count: stockResult.Items[0].count,
  };

  return {
    error: false,
    product,
  };
};

const getProducts = async () => {
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

  return productsWithCount;
};

const createProductTransaction = async (productData) => {
  const { title, description, price, id, count } = productData;
  const newProductTableItem = { title, description, price, id };
  const newStockTableItem = { product_id: id, count };

  await dynamo
    .transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: newProductTableItem,
          },
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: newStockTableItem,
          },
        },
      ],
    })
    .promise();
};

export { getProduct, getProducts, createProductTransaction };
