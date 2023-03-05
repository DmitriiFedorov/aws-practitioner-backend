import { getProducts } from "../../services/dynamoDB";
import { logger } from "../../services/Logger";

export const getProductsList = async () => {
  try {
    logger.info("START getProductsList");

    const products = await getProducts();

    logger.info("FINISH SUCCESS getProductsList");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
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
