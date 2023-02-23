"use strict";

import { products } from "./mocks/index";

export const getProductsList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

export const getProductsById = async (event) => {
  const pathParameters = event.pathParameters;
  const productId = pathParameters?.productId ?? "";

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
