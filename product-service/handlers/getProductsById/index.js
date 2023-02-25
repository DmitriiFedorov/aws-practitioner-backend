import { products } from "../../mocks";

const NOT_FOUND_RESPONSE = {
  statusCode: 404,
  body: "Not found",
};

export const getProductsById = async (event) => {
  const pathParameters = event.pathParameters;
  const productId = pathParameters?.productId ?? "";

  if (!productId) {
    return NOT_FOUND_RESPONSE;
  }

  const product = products.find((prod) => prod.id === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }

  return NOT_FOUND_RESPONSE;
};
