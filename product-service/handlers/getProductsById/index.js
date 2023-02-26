import { products } from "../../mocks";

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

  if (!productId) {
    return NOT_FOUND_RESPONSE;
  }

  const product = products.find((prod) => prod.id === productId);

  if (product) {
    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify(product),
    };
  }

  return NOT_FOUND_RESPONSE;
};
