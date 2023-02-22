"use strict";

const { products } = require("./mocks/index");

module.exports.getProductsList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

module.exports.getProductsById = async (event) => {
  const querystring = event.queryStringParameters;
  const productId = querystring?.productId ?? "";

  if (!productId) {
    return {
      statusCode: 404,
      body: "Not found",
    };
  }

  const product = products.find((prod) => prod.id === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }

  return {
    statusCode: 404,
    body: "Not found",
  };
};
