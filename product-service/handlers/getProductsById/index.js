import { logger } from "../../services/Logger";
import { getProduct } from "../../services/dynamoDB";
import {
  CORS_HEADERS,
  NOT_FOUND_RESPONSE,
  SUCCESS_REQUEST,
} from "../../constants/http";

export const getProductsById = async (event) => {
  const pathParameters = event.pathParameters;
  const productId = pathParameters?.productId ?? "";

  logger.info("START getProductsById");
  logger.info(`Product id - ${productId}`);

  if (!productId) {
    logger.info("FINISH FAIL getProductsById");
    return NOT_FOUND_RESPONSE;
  }

  try {
    const { error, product } = await getProduct(productId);

    if (error) {
      logger.info("FINISH FAIL getProductsById");
      return NOT_FOUND_RESPONSE;
    }

    logger.info("FINISH SUCCESS getProductsById");
    return {
      ...SUCCESS_REQUEST,
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
