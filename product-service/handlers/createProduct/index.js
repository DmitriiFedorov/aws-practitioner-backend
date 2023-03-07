import { randomUUID } from "crypto";

import { logger } from "../../services/Logger";
import { validateCreateProductBody } from "../../validators";
import { createProductTransaction } from "../../services/dynamoDB";
import {
  CORS_HEADERS,
  BAD_REQUEST,
  SUCCESS_CREATED,
} from "../../constants/http";

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
      return BAD_REQUEST;
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
    return SUCCESS_CREATED;
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
