import { products } from "../../mocks";

export const getProductsList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
