import { randomUUID } from "crypto";

import { logger } from "../../services/Logger";
import { validateCreateProductBody } from "../../validators";
import { createProductTransaction } from "../../services/dynamoDB";


const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const createProduct = async (event) => {
  try {
    logger.info("START createProduct");

    const { body } = event;
    const parsedBody = JSON.parse(body);

    logger.info(
      `Request params: title - ${parsedBody.title} | description - ${parsedBody.description} | price - ${parsedBody.price} | count - ${parsedBody.count}`
    );

    const { error, value } = validateCreateProductBody(parsedBody);

    if (error) {
      return {
        statusCode: 400,
        headers: {
          ...CORS_HEADERS,
        },
        body: JSON.stringify({ error: "Bad request" }),
      };
    }

    const { description, title, price, count } = value;
    const id = randomUUID();

    await createProductTransaction({
      title,
      description,
      price,
      count,
      id,
    });

    logger.info("FINISH SUCCESS createProduct");
    return {
      statusCode: 201,
      headers: {
        ...CORS_HEADERS,
      },
      body: JSON.stringify({ status: "Success" }),
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
