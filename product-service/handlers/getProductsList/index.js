import { getProducts } from "../../services/dynamoDB";
import { logger } from "../../services/Logger";
import { SUCCESS_REQUEST, CORS_HEADERS } from "../../constants/http";

export const getProductsList = async () => {
  try {
    logger.info("START getProductsList");

    const products = await getProducts();

    logger.info("FINISH SUCCESS getProductsList");
    return {
      ...SUCCESS_REQUEST,
      body: JSON.stringify(products),
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({
        error: "Something went wrong",
      }),
    };
  }
};
