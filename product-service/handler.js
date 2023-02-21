"use strict";

const { products } = require("./mocks/index");

module.exports.getProductsList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
